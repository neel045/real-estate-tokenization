const express = require("express");

const router = express.Router();
const Citizen = require("./../models/citizen");

const verifyUser = async (req, res) => {
  const isVerified = true;
  const aadhar = req.params.aadhar;
  const citizen = await Citizen.findOne({ aadhar: aadhar }).exec();
  if (!citizen) {
    isVerified = false;
  }
  res.json(isVerified);
};

const createUser = async (req, res) => {
  const citizen = new Citizen({
    name: req.body.name,
    aadhar: req.body.aadhar,
    email: req.body.email,
    phone: req.body.phone,
    retId: req.body.retId,
    address: req.body.address,
  });

  try {
    const c1 = await citizen.save();
    res.json(c1);
  } catch (error) {
    res.json(error);
  }
};

const updateRET = async (req, res) => {
  let citizen = await Citizen.findOneAndUpdate(
    { aadhar: req.params.aadhar },
    { retId: req.body.retId }
  );

  res.json(citizen);
};

const getCitizen = async (req, res) => {
  const retId = req.body.retId;
  const citizen = await Citizen.findOne({ retId: retId });
  if (citizen) res.json(citizen.aadhar);
  res.json(false);
};
router.get("/", getCitizen);
router.get("/:aadhar", verifyUser);
router.post("/:aadhar", updateRET);
router.post("/", createUser);

module.exports = router;
