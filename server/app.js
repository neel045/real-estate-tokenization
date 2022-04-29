const express = require("express");
const citizenRouter = require("./routes/citizenRouter");
const propertyRouter = require("./routes/propertyRouter");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const cors = require("cors");

app.use(express.json({ limit: "10kb" }));

app.use(cors());

app.use("/api/v1/citizens", citizenRouter);
app.use("/api/v1/properties", propertyRouter);

module.exports = app;
