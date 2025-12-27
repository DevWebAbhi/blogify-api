const Post = require('../models/post.model');
const ApiError = require('../utils/ApiError');

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const author = req.user && req.user._id ? req.user._id : req.body.author;
    if (!title || !content) {
      return next(new ApiError(400, 'Missing required fields'));
    }

    const post = await Post.create({ title, content, author });
    return res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.isDeleted;

    const updated = await Post.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(new ApiError(404, 'Post not found'));
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isDeleted: false });
    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id, isDeleted: false });
    if (!post) {
      return next(new ApiError(404, 'Post not found'));
    }
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Post.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!updated) {
      return next(new ApiError(404, 'Post not found or already deleted'));
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
