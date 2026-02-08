const Post = require('../models/post.model');

const createPost = async ({ title, content, author }) => {
  const created = await Post.create({ title, content, author });
  return Post.findById(created._id).populate('author', 'name email');
};

const getAllPosts = async () => {
  return Post.find({ isDeleted: false }).populate('author', 'name email').sort({ createdAt: -1 }).limit(100);
};

const getPostById = async (id) => {
  return Post.findOne({ _id: id, isDeleted: false }).populate('author', 'name email');
};

const updatePost = async (id, updates) => {
  delete updates.isDeleted;
  return Post.findOneAndUpdate({ _id: id, isDeleted: false }, updates, { new: true, runValidators: true }).populate('author', 'name email');
};

const deletePost = async (id) => {
  return Post.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
