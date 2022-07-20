import { PDFExtract } from "pdf.js-extract";
import Ajv from "ajv";
import { invoiceSchema } from "./Schemas/invoiceSchema.js";
import { creditNoteSchema } from "./Schemas/creditNoteSchema.js";
import fs from 'fs';
import request from "request-promise-native";
import { from } from 'ix/asynciterable/index.js';
import { map } from 'ix/asynciterable/operators/index.js';

const ajv = new Ajv()
const pdfExtract = new PDFExtract();


let otherPresent = false;
let otherY = 0;
function tableData1(data, index, slice1 = 1, slice2 = 0) {
  const mapped = data.map((each) => { 
    if(each && Math.floor(each.x) == Math.floor(index.x)) {
      return each;
    }
  }).filter((each) => each);

  if(index == ind6 && mapped.length > 2){ 
    otherPresent = true;
    otherY = mapped[mapped.length-1].y;
  }

  if(slice2){
    return mapped.map((each) => each.str).slice(slice1, slice2).join(" ");
  }else{
    const filtered = mapped.map((each) => each.str)
    return otherPresent ? filtered.slice(1, filtered.length-1).join(" ") : filtered.slice(1).join(" ");
  }
}
function tableData2(data, index, slice1 = 1, slice2 = 0) {
  const mapped = data.map((each) => { 
    if(each && Math.floor(each.x) == Math.floor(index.x)) { return each }
  }).filter((each) => each);
  
  return slice2 ? mapped.map((each) => each.str).slice(slice1, slice2).join(" ") : mapped.map((each) => each.str).slice(1).join(" ");
}

function isInvoice(data) {
  return data.find((each) => each.str == "Tax Invoice") ? true : false;
}
function isCreditNote(data) {
  return data.find((each) => each.str == "Credit Note") ? true : false;
}

async function downloadPDF(pdfURL, outputFilename) {
  let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
  fs.writeFileSync(outputFilename, pdfBuffer);
}

const source = async function* () {
  var csv = fs.readFileSync("ms.csv")
  var array = csv.toString().split("\r");

  for(let i=3; i<array.length; i++){
      let properties = array[i].split(",");
      if(properties[properties.length-2] != "") yield properties[properties.length-2];
  }
};

let ans1 = {};
let ans2 = {};
let other1 = {};
let ind6;
const options = {};

async function complete(url) {
  await downloadPDF(url, "./pdfs/somePDF.pdf");
  pdfExtract.extract("./pdfs/somePDF.pdf", options)
    .then(data => { return data.pages[0].content })
    .then(data => {
      if(isCreditNote(data)){ return complete2(url) }
      else if(isInvoice(data)){ return complete1(url) }
      else{throw "Invalid Invoice/CreditNote";}
    })
    .catch(err=> console.log(err));
}

async function complete1(url) {
  pdfExtract.extract("./pdfs/somePDF.pdf", options)
    .then(data => { return data.pages[0].content })
    .then(data => {
      let ind1 = data.findIndex((each) => each.str == "Purchase Order Number");
      let ind2 = data.findIndex((each) => each.str == "Invoice Number");
      let ind3 = data.findIndex((each) => each.str == "Invoice Date");
      let ind4 = data.findIndex((each) => each.str == "Order Date");
      let ind5 = data.find((each) => each.str == "Description");
          ind6 = data.find((each) => each.str == "HSN");
      let ind7 = data.find((each) => each.str == "Unit Price");
      let ind8 = data.find((each) => each.str == "Discount");
      let ind9 = data.find((each) => each.str == "Product");
      let ind10 = data.find((each) => each.str == "Taxes");
      let ind11 = data.find((each) => each.str == "Total");

      ans1["Purchase Order Number"] = data[ind1 + 2].str;     
      ans1["Invoice Number"] = data[ind2 + 2].str;
      ans1["Invoice Date"] = data[ind3 + 2].str;
      ans1["Order Date"] = data[ind4 + 2].str;
      ans1["HSN"] = tableData1(data, ind6, 1);
      ans1["Description"] = tableData1(data, ind5, 1); 
      ans1["Unit Price"] = tableData1(data, ind7, 1, 2);
      ans1["Discount"] = tableData1(data, ind8, 1, 2);
      ans1["Product Value"] = tableData1(data, ind9, 2, 3);
      ans1["Taxes"] = tableData1(data, ind10, 1, 2);
      ans1["Total"] = tableData1(data, ind11, 1, 2);

      if(otherPresent){
        other1["Purchase Order Number"] = data[ind1 + 2].str;
        other1["Invoice Number"] = data[ind2 + 2].str;
        other1["Invoice Date"] = data[ind3 + 2].str;
        other1["Order Date"] = data[ind4 + 2].str;
        other1["Description"] = data.map((each) => { if(each && Math.floor(each.x) == Math.floor(ind5.x) && Math.floor(each.y) >= Math.floor(otherY)) { return each.str }}).filter((each) => each).join(" ");
        other1["HSN"] = tableData1(data, ind6, 2, 3);
        other1["Unit Price"] = tableData1(data, ind7, 2, 3);
        other1["Discount"] = tableData1(data, ind8, 2, 3);
        other1["Product Value"] = tableData1(data, ind9, 3, 4);
        other1["Taxes"] = tableData1(data, ind10, 2, 3);
        other1["Total"] = tableData1(data, ind11, 2, 3);
      }
      return [ans1, other1];
    })
    .then((ans) => {
      let valid1 = ajv.validate(invoiceSchema, ans[0]);
      let valid2 = true;

      if(otherPresent){
        valid2 = ajv.validate(invoiceSchema, ans[1]);
      }
      if(!valid1 || !valid2) {throw ajv.errors} else console.log(ans);
    })
    .catch(err=> console.log(err));
}

async function complete2(url) {
  pdfExtract.extract("./pdfs/somePDF.pdf", options)
    .then(data => { return data.pages[0].content })
    .then(data => {
      let in0 = data.findIndex((each) => each.str.search("Purchase Order Number:") != -1);
      let in1 = data.findIndex((each) => each.str.search("Credit Note No:") != -1);
      let in2 = data.findIndex((each) => each.str.search("Order Date:") != -1);
      let in3 = data.findIndex((each) => each.str.search("Credit Note Date:") != -1);
      let in4 = data.findIndex((each) => each.str.search("Invoice No and Date:") != -1);
      let in5 = data.find((each) => each.str == "Description");
      let in6 = data.find((each) => each.str == "HSN");
      let in7 = data.find((each) => each.str == "Unit Price");
      let in8 = data.find((each) => each.str == "Discount");
      let in9 = data.find((each) => each.str == "Product");
      let in10 = data.find((each) => each.str == "Taxes");
      let in11 = data.find((each) => each.str == "Total");

      ans2["Purchase Order Number"] = data[in0].str.slice(23);
      ans2["Credit Note No"] = data[in1].str.slice(16);
      ans2["Order Date"] = data[in2].str.slice(12);
      ans2["Credit Note Date"] = data[in3].str.slice(18);
      ans2["Invoice No and Date"] = data[in4].str.slice(21);
      ans2["HSN"] = tableData2(data, in6, 1);
      ans2["Description"] = tableData2(data, in5, 1); 
      ans2["Unit Price"] = tableData2(data, in7, 1, 2);
      ans2["Discount"] = tableData2(data, in8, 1, 2);
      ans2["Product Value"] = tableData2(data, in9, 2, 3);
      ans2["Taxes"] = tableData2(data, in10, 1, 2);
      ans2["Total"] = tableData2(data, in11, 1, 2);

      return ans2;
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
