const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost/exForum")
  .then(() => console.log("Database successfully connected!"))
  .catch((error) => console.log(error));

// Routes
const postsRouter = require("./src/routes/posts");

// Route files as needed
app.use("/posts", postsRouter);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
