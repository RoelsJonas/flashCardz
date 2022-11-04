var {Schema, model} = require("../db/connection.js");

const ImageSchema = Schema({
  fileName: {
    type: String,
    required: true,
  },
  file: {
    data: Buffer,
    contentType: String,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
});

var Image = model("Image", ImageSchema);

module.exports = Image;