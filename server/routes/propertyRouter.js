const express = require("express");

const Property = require("./../models/property");
const router = express.Router();
const multer = require("multer");
const { path } = require("../app");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.params.propertyId + path.extname(file.originalname));
  },
});

const verifyProperty = async (req, res) => {
  let isVerified = true;
  const propertyId = req.body.propertyId;
  const ownerId = req.body.ownerId;

  const property = await Property.findOne({
    propertyId: propertyId,
    ownerId: ownerId,
  }).exec();
  if (!property) {
    isVerified = false;
  }
  res.json(isVerified);
};

const createProperty = async (req, res) => {
  const property = new Property({
    address: req.body.address,
    ownerId: req.body.ownerId,
    pinCode: req.body.pinCode,
    propertyId: req.body.propertyId,
    image: "" + req.body.property + ".jpeg",
  });

  try {
    const p1 = await property.save();
    res.json(p1);
  } catch (error) {
    res.json(error);
  }
};

router.get("/verify-property", verifyProperty);
router.post("/", createProperty);
router.post("/upload/:propertyId");
module.exports = router;
