import { PDFExtract } from "pdf.js-extract";
import Ajv from "ajv";
import { creditNoteSchema } from "./Schemas/creditNoteSchema.js";
import fs from 'fs';
import request from "request-promise-native";
import { from } from 'ix/asynciterable/index.js';
import { map } from 'ix/asynciterable/operators/index.js';

const pdfExtract = new PDFExtract();
const ajv = new Ajv()


function tableData(data, index, slice1 = 1, slice2 = 0) {
  const mapped = data.map((each) => { 
    if(each && Math.floor(each.x) == Math.floor(index.x)) { return each }
  }).filter((each) => each);
  
  return slice2 ? mapped.map((each) => each.str).slice(slice1, slice2).join(" ") : mapped.map((each) => each.str).slice(1).join(" ");
}

function isCreditNote(data) {
    return data.find((each) => each.str == "Credit Note") ? true : false;
}

async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
  console.log("Writing downloaded PDF file to " + outputFilename + "...");
  fs.writeFileSync(outputFilename, pdfBuffer);
}

const source = async function* () {
  var csv = fs.readFileSync("ms.csv")
  var array = csv.toString().split("\r");

  for(let i=3; i<array.length; i++){
      let properties = array[i].split(",");
      yield properties[properties.length-2];
  }
};

let ans = {};
const options = {};
async function complete(url) {
  await downloadPDF(url, "./pdfs/somePDF.pdf");
  pdfExtract.extract("./pdfs/somePDF.pdf", options)
    .then(data => { return data.pages[0].content })
    .then(data => {
      if(isCreditNote(data)){return data}
      else{throw "Invalid Credit Invoice";}
    })
    .then(data => {
      let ind0 = data.findIndex((each) => each.str.search("Purchase Order Number:") != -1);
      let ind1 = data.findIndex((each) => each.str.search("Credit Note No:") != -1);
      let ind2 = data.findIndex((each) => each.str.search("Order Date:") != -1);
      let ind3 = data.findIndex((each) => each.str.search("Credit Note Date:") != -1);
      let ind4 = data.findIndex((each) => each.str.search("Invoice No and Date:") != -1);
      let ind5 = data.find((each) => each.str == "Description");
      let ind6 = data.find((each) => each.str == "HSN");
      let ind7 = data.find((each) => each.str == "Unit Price");
      let ind8 = data.find((each) => each.str == "Discount");
      let ind9 = data.find((each) => each.str == "Product");
      let ind10 = data.find((each) => each.str == "Taxes");
      let ind11 = data.find((each) => each.str == "Total");

      ans["Purchase Order Number"] = data[ind0].str.slice(23);
      ans["Credit Note No"] = data[ind1].str.slice(16);
      ans["Order Date"] = data[ind2].str.slice(12);
      ans["Credit Note Date"] = data[ind3].str.slice(18);
      ans["Invoice No and Date"] = data[ind4].str.slice(21);
      ans["HSN"] = tableData(data, ind6, 1);
      ans["Description"] = tableData(data, ind5, 1); 
      ans["Unit Price"] = tableData(data, ind7, 1, 2);
      ans["Discount"] = tableData(data, ind8, 1, 2);
      ans["Product Value"] = tableData(data, ind9, 2, 3);
      ans["Taxes"] = tableData(data, ind10, 1, 2);
      ans["Total"] = tableData(data, ind11, 1, 2);

      return ans;
    })
    .then((ans) => {
      const valid = ajv.validate(creditNoteSchema, ans)
      if(!valid) {throw ajv.errors} else console.log(ans);
    })
    .catch(err=> console.log(err));
}

const results = from(source()).pipe(
  map(async x => complete(x))
);

for await (let item of results) {
  console.log(`Next: ${item}`);
}