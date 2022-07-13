export const creditNoteSchema = {
    type: "object",
    properties: {
      "Purchase Order Number": {type: "string", minLength: 12, maxLength: 12},
      'Credit Note No': {type: "string", minLength: 10, maxLength: 10},
      'Order Date': {type: "string", minLength: 16, maxLength: 20},
      'Credit Note Date': {type: "string", minLength: 16, maxLength: 20},
      'Invoice No and Date': {type: "string", minLength: 26, maxLength: 30},
      'HSN': {type: "string", minLength: 4, maxLength: 6},
      'Description': {type: "string", minLength: 1},
      'Unit Price': {type: "string", minLength: 3},
      'Discount': {type: "string", minLength: 1},
      'Product Value': {type: "string", minLength: 3},
      'Taxes': {type: "string", minLength: 3},
      'Total': {type: "string", minLength: 3},
    },
    required: ["Purchase Order Number", "Credit Note No", "Order Date", "Credit Note Date", "Invoice No and Date", "HSN", "Description", "Unit Price", "Discount", "Product Value", "Taxes", "Total"],
    additionalProperties: false
  }