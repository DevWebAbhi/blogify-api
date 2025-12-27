const postsService = require('../services/posts.service');
const ApiError = require('../utils/ApiError');

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const author = req.user && req.user._id ? req.user._id : req.body.author;
    if (!title || !content) {
      return next(new ApiError(400, 'Missing required fields'));
    }

    const post = await postsService.createPost({ title, content, author });
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

    const updated = await postsService.updatePost(id, updates);

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
    const posts = await postsService.getAllPosts();
    return res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await postsService.getPostById(id);
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
    const updated = await postsService.deletePost(id);

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
