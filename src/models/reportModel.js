const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  forComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  commenterEmail: {
    type: String,
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
