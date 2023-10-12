const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth");
const config = require("./config");
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongoDB connection error"));
app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("the server is running");
});
app.use("/auth", authRoute);
app.listen(config.port, () => {
  console.log(`the server is running on the port${config.port}`);
});
