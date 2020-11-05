const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect database
connectDB();

// When deploying on heroku, process.env.PORT will read env var
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API Running");
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
