const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const dbConnection = require("./config/db");

const app = express();

dbConnection();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ extended: false }));

app.use("/api", require("./routes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
