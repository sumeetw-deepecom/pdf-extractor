const PDFExtract = require("pdf.js-extract").PDFExtract;

function tableData(data, index, slice1 = 1, slice2 = 0) {
  const mapped = data.map((each) => { 
    if(each && Math.floor(each.x) == Math.floor(index.x)) {
      return each;
    }
  }).filter((each) => each);


  if(slice2){
    return mapped.map((each) => each.str).filter((each) => each).slice(slice1, slice2).join(" ");
  }else{
    const filtered = mapped.map((each) => each.str).filter((each) => each)
    return filtered.slice(1).join(" ");
  }
}

let ans = {};
const pdfExtract = new PDFExtract();
const options = {};
pdfExtract.extract("credit.pdf", options)
.then(data => { console.log(data.pages[0].content); return data.pages[0].content })
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

    console.log(ans);
  })
  .catch(err=> console.log(err));

