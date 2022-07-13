export const invoiceSchema = {
    type: "object",
    properties: {
      'Purchase Order Number': {type: "string", minLength: 12, maxLength: 12},
      'Invoice Number': {type: "string", minLength: 10, maxLength: 10},
      'Invoice Date': {type: "string", minLength: 16, maxLength: 20},
      'Order Date': {type: "string", minLength: 16, maxLength: 20},
      'HSN': {type: "string", minLength: 4, maxLength: 5},
      'Description': {type: "string", minLength: 1},
      'Unit Price': {type: "string", minLength: 3},
      'Discount': {type: "string", minLength: 1},
      'Product Value': {type: "string", minLength: 3},
      'Taxes': {type: "string", minLength: 3},
      'Total': {type: "string", minLength: 3},
    },
    required: ["Purchase Order Number", "Invoice Number", "Invoice Date", "Order Date", "HSN", "Description", "Unit Price", "Discount", "Product Value", "Taxes", "Total"],
    additionalProperties: false
  }