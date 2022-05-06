const express = require("express");

const Property = require("./../models/property");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const sharp = require("sharp");

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

const uploadImage = upload.fields([{ name: "image", maxCount: 1 }]);
const resizeImages = async (req, res, next) => {
  const filename = `${req.params.propertyId}.jpeg`;
  await sharp(req.files.image[0].buffer)
    .toFormat("jpeg")
    .toFile(`public/images/${filename}`);

  res.json("saved");
};

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
  return res.json(isVerified);
};

const createProperty = async (req, res) => {
  const property = new Property({
    address: req.body.address,
    ownerId: req.body.ownerId,
    pinCode: req.body.pinCode,
    propertyId: req.body.propertyId,
    image: "" + req.body.propertyId + ".jpeg",
    details: req.body.details,
  });

  try {
    const p1 = await property.save();
    res.json(p1);
  } catch (error) {
    res.json(error);
  }
};

const getProperty = async (req, res) => {
  const property = await Property.findOne({
    propertyId: req.params.propertyId,
  }).exec();
  if (!property) return res.json("fail");
  return res.json(property);
};

router.get("/verify-property", verifyProperty);
router.get("/:propertyId", getProperty);
router.post("/", createProperty);
router.post("/upload/:propertyId", uploadImage, resizeImages);
module.exports = router;
