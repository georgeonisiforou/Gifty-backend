var express = require("express");
var cors = require("cors");
var app = express();
const mongoose = require("mongoose");
require("dotenv").config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@todolist.pozp13j.mongodb.net/?retryWrites=true&w=majority`
  );
}

var wishlist = require("./routes/wishlist.js");

app.use(cors());

app.use(express.json());

app.use("/wishlist", wishlist);

app.get("/", (req, res) => {
  res.send("test");
});

app.all("*", (req, res) => {
  res.status(404).send("<h1>404! Page not found!</h1>");
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal server error" });
});

app.listen(3001);
