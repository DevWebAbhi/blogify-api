// Get all posts

const dummyPosts = require("../utils/data");


const getAllPosts = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: dummyPosts
  });
};

const getPostById = (req, res) => {
  const postId = Number(req.params.postId);
  if (Number.isNaN(postId)) {
    return res.status(400).json({ success: false, message: 'Invalid post id' });
  }

  const post = dummyPosts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  return res.status(200).json({
    success: true,
    message: 'Fetching data for post with ID: ' + postId,
    postId: postId,
    data: post
  });
};

module.exports = {
  getAllPosts,
  getPostById
};
