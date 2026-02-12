const express = require('express');
const {
  createPost,
  getAllPosts,
  getAllPostsWithAuthors,
  getPostById,
  deletePost,
  updatePost,
} = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/authorize.middleware');

const router = express.Router();

router.post('/posts', protect, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/with-authors', getAllPostsWithAuthors);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);

module.exports = router;
