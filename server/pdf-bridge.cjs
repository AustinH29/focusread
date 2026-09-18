'use strict';
const { PDFParse } = require('pdf-parse');
module.exports = {
  parsePdf: async (buffer) => {
    const parser = new PDFParse({ data: buffer });
    return await parser.getText();
  },
};
