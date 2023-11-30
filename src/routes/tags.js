const express = require("express");
const router = express.Router();

const Tags = require("../models/tagsModel");

const checkToken = require("../middlewares/authentication/verifyToken");
const checkAdmin = require("../middlewares/authentication/verifyAdmin");

// GET ALL
router.get("/", checkToken, async (req, res) => {
  try {
    const data = await Tags.find();
    res.status(200).json({
      data,
      message: "Tags successfully retrieved",
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
    const newPost = new Tags(req.body);
    await newPost.save();
    res.status(200).json({
      message: "Tags successfully added",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// PUT ONE: UPDATE ONE
router.put("/:id", async (req, res) => {
  try {
    await Tags.updateOne(
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
router.delete("/:id", checkToken, checkAdmin, async (req, res) => {
  try {
    const result = await Tags.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      // Document was deleted successfully
      res.status(200).json({
        message: "Tags successfully deleted",
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
