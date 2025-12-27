const express = require('express');
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
} = require('../controllers/post.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/posts', authenticate, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', authenticate, updatePost);
router.delete('/posts/:id', authenticate, authorize('admin'), deletePost);

module.exports = router;
