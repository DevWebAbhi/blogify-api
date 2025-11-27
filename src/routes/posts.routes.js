const express = require("express");
const { getAllPosts, getPostById } = require("../controllers/posts.controller");

const router = express.Router();

// Get all posts
router.get("/", getAllPosts);

// Get single post by id
router.get("/:postId", getPostById);

module.exports = router;
