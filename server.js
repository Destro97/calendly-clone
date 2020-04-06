const express = require("express");
const cors = require("cors");

const dbConnection = require("./config/db");

const app = express();

dbConnection();

if (process.env.NODE_ENV !== "production") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/", require("./routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
