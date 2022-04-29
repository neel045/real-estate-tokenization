const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!💥 Shutting Down...");
  console.log(err.name, err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

// const DB = process.env.DATABASE_LOCAL; for local connection

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Hi From the DB connection 🖐️");
    console.log(process.env.NODE_ENV);
  });
const port = process.env.PORT || 3000;

const server = app.listen(port, "127.0.0.1", () => {
  console.log(`Server is Running at http://127.0.0.1:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION!💥 Shutting Down...");
  server.close(() => {
    process.exit(1);
  });
});

// console.log(x);
