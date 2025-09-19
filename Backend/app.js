const express = require("express");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use("/", (req, res, next) => {
  res.send("Hello from express");
});

mongoose
  .connect(
    "mongodb+srv://vihigum:cVcYE2YOBTmozQ44@cluster0.sp3lpkf.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));