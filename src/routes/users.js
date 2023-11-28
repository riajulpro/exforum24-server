const express = require("express");
const router = express.Router();

const User = require("../models/userModel");

const checkToken = require("../middlewares/authentication/verifyToken");
const checkAdmin = require("../middlewares/authentication/verifyAdmin");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json({
      data,
      message: "User successfully retrieved",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// GET ONE
router.get("/:email", checkToken, async (req, res) => {
  try {
    const data = await User.find({
      email: req.params.email,
    });
    res.status(200).json({
      data,
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
    const newPost = new User(req.body);
    await newPost.save();
    res.status(200).json({
      message: "User successfully added",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// PUT ONE: UPDATE
router.put("/:id", checkToken, checkAdmin, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.status(200).json({
      message: "User successfully updated",
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
    const result = await User.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      // Document was deleted successfully
      res.status(200).json({
        message: "User successfully deleted",
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
