const mongoose = require("mongoose");
const Validator = require("Validator");

const citizenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "you need name"],
  },
  aadhar: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    validate: [Validator.isEmail, "please enter email"],
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  retId: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
});

citizenSchema.index(
  { aadhar: 1, retId: 1 },
  { unique: true, partialFilterExpression: { retId: { $type: "strings" } } }
);
module.exports = mongoose.model("Citizen", citizenSchema);
