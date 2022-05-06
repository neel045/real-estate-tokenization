const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "you need Address"],
    unique: true,
  },
  ownerId: {
    type: Number,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  propertyId: {
    type: Number,
    unique: true,
    required: true,
  },
  image: {
    type: String,
  },
  details: {
    type: String,
  },
});

module.exports = mongoose.model("Property", propertySchema);
