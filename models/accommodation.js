let mongoose = require("mongoose");

// accommodation Schema
let accommodationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  telephone: {
    type: Number,
    required: true,
  },
  accEmail: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  singlePrice: {
    type: String,
    required: true,
  },
  sharingPrice: {
    type: String,
    required: true,
  },
  male: {
    type: String,
    required: true,
  },
  female: {
    type: String,
    required: true,
  },
});

let Accommodation = (module.exports = mongoose.model(
  "Accommodation",
  accommodationSchema
));
