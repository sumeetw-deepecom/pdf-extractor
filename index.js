const PDFExtract = require("pdf.js-extract").PDFExtract;

let otherPresent = false;
let otherY = 0;
function tableData(data, index, slice1 = 1, slice2 = 0) {
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
    return mapped.map((each) => each.str).filter((each) => each).slice(slice1, slice2).join(" ");
  }else{
    const filtered = mapped.map((each) => each.str).filter((each) => each)
    return filtered.slice(1, filtered.length-1).join(" ");
  }
}


let ans = {};
let other = {};
let ind6;
const pdfExtract = new PDFExtract();
const options = {};
pdfExtract.extract("52ef5f79673cd8e23f64621586bb38f6d5c341de.pdf", options)
  .then(data => data.pages[0].content)
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

    ans["Purchase Order Number"] = data[ind1 + 2].str;
    ans["Invoice Number"] = data[ind2 + 2].str;
    ans["Invoice Date"] = data[ind3 + 2].str;
    ans["Order Date"] = data[ind4 + 2].str;
    ans["Description"] = tableData(data, ind5, 1); 
    ans["HSN"] = tableData(data, ind6, 1);
    ans["Unit Price"] = tableData(data, ind7, 1, 2);
    ans["Discount"] = tableData(data, ind8, 1, 2);
    ans["Product Value"] = tableData(data, ind9, 2, 3);
    ans["Taxes"] = tableData(data, ind10, 1, 2);
    ans["Total"] = tableData(data, ind11, 1, 2);

    if(otherPresent){
      other["Purchase Order Number"] = data[ind1 + 2].str;
      other["Invoice Number"] = data[ind2 + 2].str;
      other["Invoice Date"] = data[ind3 + 2].str;
      other["Order Date"] = data[ind4 + 2].str;
      other["Description"] = data.map((each) => { if(each && Math.floor(each.x) == Math.floor(ind5.x) && Math.floor(each.y) >= Math.floor(otherY)) { return each.str }}).filter((each) => each).join(" ");
      other["HSN"] = tableData(data, ind6, 2, 3);
      other["Unit Price"] = tableData(data, ind7, 2, 3);
      other["Discount"] = tableData(data, ind8, 2, 3);
      other["Product Value"] = tableData(data, ind9, 3, 4);
      other["Taxes"] = tableData(data, ind10, 2, 3);
      other["Total"] = tableData(data, ind11, 2, 3);
    }

    console.log([ans, other]);
  })
  .catch(err=> console.log(err));

