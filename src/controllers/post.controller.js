const postsService = require('../services/posts.service');
const ApiError = require('../utils/ApiError');
const Post = require('../models/post.model');
const { encodeCursor, decodeCursor } = require('../utils/cursor');

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
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const encodedCursor = req.query.cursor;

    // Decode cursor if present
    let cursor = null;
    if (encodedCursor) {
      cursor = decodeCursor(encodedCursor);
    }

    // Build query: get posts AFTER cursor (newer to older by _id)
    const query = cursor ? { _id: { $lt: cursor }, isDeleted: { $ne: true } } : { isDeleted: { $ne: true } };

    // Fetch limit + 1 to determine if there are more
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(limit + 1)
      .select('-title -author');
      console.log(posts)

    const hasMore = posts.length > limit;
    if (hasMore) posts.pop();

    const nextCursor = hasMore && posts.length > 0
      ? encodeCursor(posts[posts.length - 1]._id)
      : null;

    return res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        nextCursor,
        hasMore,
        limit,
        count: posts.length,
      },
    });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

const getAllPostsWithAuthors = async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          content: 1,
          createdAt: 1,
          authorId: '$author',
          authorDetails: {
            _id: '$authorDetails._id',
            name: '$authorDetails.name',
            email: '$authorDetails.email',
            role: '$authorDetails.role',
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const posts = await Post.aggregate(pipeline).limit(100);
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
  getAllPostsWithAuthors,
  getPostById,
  updatePost,
  deletePost,
};
