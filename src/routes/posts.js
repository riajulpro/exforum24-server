const express = require("express");
const router = express.Router();

const Post = require("../models/postModel");

const checkToken = require("../middlewares/authentication/verifyToken");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / pageSize);

    const data = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      data,
      currentPage: page,
      totalPages,
      message: "Post successfully retrieved",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

router.get("/mine/:id", async (req, res) => {
  try {
    const data = await Post.find({ author: req.params.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      data,
      message: "Post successfully retrieved",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// GET SPECIFIC BY SEARCH
router.get("/search", async (req, res) => {
  try {
    const search = req.query.q;

    const query = { tags: { $in: [search] } };

    const data = await Post.find(query);

    res.status(200).json({
      data,
      message: "Search result successfully retrieved",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// GET ALL ITEMS AT ONCE
router.get("/tags", async (req, res) => {
  try {
    const data = await Post.find();

    const uniqueTagsSet = new Set();

    // Iterate through each object and its tags
    data.forEach((obj) => {
      obj.tags.forEach((tag) => {
        uniqueTagsSet.add(tag);
      });
    });

    // Convert Set to array to get the unique tags
    const uniqueTagsArray = [...uniqueTagsSet];

    res.status(200).json({
      uniqueTags: uniqueTagsArray,
      message: "Search result successfully retrieved",
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
    const data = await Post.find({
      _id: req.params.id,
    });
    res.status(200).json({
      data,
      message: "Post successfully retrieved",
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
    const newPost = new Post(req.body);
    await newPost.save();

    res.status(200).json({
      message: "Post successfully added",
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server error!",
    });
  }
});

// PUT ONE: UPDATE
router.put("/:id", async (req, res) => {
  try {
    await Post.updateOne(
      { _id: req.params.id },
      {
        $set: req.body,
      }
    );
    res.status(200).json({
      message: "Post successfully updated",
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
    const result = await Post.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      // Document was deleted successfully
      res.status(200).json({
        message: "Post successfully deleted",
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
