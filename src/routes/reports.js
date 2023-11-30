const express = require("express");
const router = express.Router();

const Report = require("../models/reportModel");

const checkToken = require("../middlewares/authentication/verifyToken");
const checkAdmin = require("../middlewares/authentication/verifyAdmin");

// GET ALL
router.get("/", checkToken, checkAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;

    const totalReports = await Report.countDocuments();
    const totalPages = Math.ceil(totalReports / pageSize);

    const data = await Report.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      data,
      currentPage: page,
      totalPages,
      message: "Users successfully retrieved",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// GET ONE
router.get("/:id", async (req, res) => {
  try {
    const data = await Report.find({
      _id: req.params.id,
    });
    res.status(200).json({
      result: data,
      message: "Data successfully retrieved",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// POST ONE
router.post("/", async (req, res) => {
  try {
    const newPost = new Report(req.body);
    await newPost.save();
    res.status(200).json({
      message: "Report successfully added",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// POST ALL
router.post("/all", async (req, res) => {
  try {
    await Report.insertMany(req.body);
    res.status(200).json({
      message: "Report successfully added",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// PUT ONE: UPDATE
router.put("/:id", async (req, res) => {
  try {
    await Report.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: "active",
        },
      }
    );
    res.status(200).json({
      message: "Data successfully updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// DELETE ONE
router.delete("/:id", async (req, res) => {
  try {
    const result = await Report.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      // Document was deleted successfully
      res.status(200).json({
        message: "Report successfully deleted",
      });
    } else {
      // Document with the given ID was not found
      res.status(404).json({
        error: "Document not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

module.exports = router;
