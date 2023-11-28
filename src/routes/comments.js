const express = require("express");
const router = express.Router();

const Comment = require("../models/commentModel");

const checkToken = require("../middlewares/authentication/verifyToken");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json({
      data,
      message: "Comment successfully retrieved",
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
    const data = await Comment.find({
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
router.post("/", checkToken, async (req, res) => {
  try {
    const newPost = new Comment(req.body);
    await newPost.save();
    res.status(200).json({
      message: "Comment successfully added",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// PUT ONE: UPDATE
router.put("/:id", checkToken, async (req, res) => {
  try {
    await Comment.updateOne(
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
router.delete("/:id", checkToken, async (req, res) => {
  try {
    const result = await Comment.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      // Document was deleted successfully
      res.status(200).json({
        message: "Comment successfully deleted",
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
