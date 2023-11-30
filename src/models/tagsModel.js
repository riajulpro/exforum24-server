const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

const Report = mongoose.model("Tags", tagsSchema);

module.exports = Report;
