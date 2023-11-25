const express = require("express");
const router = express.Router();

const Announcement = require("../models/announcementModel");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Announcement.find();
    res.status(200).json({
      data,
      message: "Announcement successfully retrieved",
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
    const data = await Announcement.find({
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
    const newPost = new Announcement(req.body);
    await newPost.save();
    res.status(200).json({
      message: "Announcement successfully added",
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
    await Announcement.insertMany(req.body);
    res.status(200).json({
      message: "Announcement successfully added",
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
    await Announcement.updateOne(
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
    const result = await Announcement.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      // Document was deleted successfully
      res.status(200).json({
        message: "Announcement successfully deleted",
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
