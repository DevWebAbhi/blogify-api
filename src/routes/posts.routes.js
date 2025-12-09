const express = require("express");
const { getAllPosts, getPostById } = require("../controllers/posts.controller");

const router = express.Router();


router.get("/", getAllPosts);


router.get("/:postId", getPostById);

module.exports = router;
