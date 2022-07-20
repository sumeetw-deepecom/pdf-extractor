export const invoiceSchema = {
    type: "object",
    properties: {
      'Purchase Order Number': {type: "string", minLength: 10, maxLength: 14},
      'Invoice Number': {type: "string", minLength: 8, maxLength: 12},
      'Invoice Date': {type: "string", minLength: 16, maxLength: 20},
      'Order Date': {type: "string", minLength: 16, maxLength: 20},
      'HSN': {type: "string"},
      'Description': {type: "string"},
      'Unit Price': {type: "string"},
      'Discount': {type: "string"},
      'Product Value': {type: "string"},
      'Taxes': {type: "string"},
      'Total': {type: "string"},
    },
    required: ["Purchase Order Number", "Invoice Number", "Invoice Date", "Order Date", "HSN", "Description", "Unit Price", "Discount", "Product Value", "Taxes", "Total"],
    additionalProperties: false
  }