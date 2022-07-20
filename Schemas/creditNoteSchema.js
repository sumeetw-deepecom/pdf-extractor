export const creditNoteSchema = {
    type: "object",
    properties: {
      "Purchase Order Number": {type: "string", minLength: 10, maxLength: 14},
      'Credit Note No': {type: "string", minLength: 8, maxLength: 12},
      'Order Date': {type: "string", minLength: 16, maxLength: 20},
      'Credit Note Date': {type: "string", minLength: 16, maxLength: 20},
      'Invoice No and Date': {type: "string", minLength: 26, maxLength: 32},
      'HSN': {type: "string"},
      'Description': {type: "string"},
      'Unit Price': {type: "string"},
      'Discount': {type: "string"},
      'Product Value': {type: "string"},
      'Taxes': {type: "string"},
      'Total': {type: "string"},
    },
    required: ["Purchase Order Number", "Credit Note No", "Order Date", "Credit Note Date", "Invoice No and Date", "HSN", "Description", "Unit Price", "Discount", "Product Value", "Taxes", "Total"],
    additionalProperties: false
  }