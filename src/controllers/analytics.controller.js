const Post = require('../models/post.model');
const ApiError = require('../utils/ApiError');

const getTopAuthors = async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { isDeleted: false } },
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          authorId: '$_id',
          postCount: 1,
          authorDetails: {
            _id: '$authorDetails._id',
            name: '$authorDetails.name',
            email: '$authorDetails.email',
          },
        },
      },
    ];

    const results = await Post.aggregate(pipeline);
    return res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, 'Failed to fetch top authors'));
  }
};

const getTopAuthorsFlat = async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { isDeleted: false } },
      { $group: { _id: '$author', postCount: { $sum: 1 } } },
      { $sort: { postCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          authorId: { $convert: { input: '$_id', to: 'string', onError: null, onNull: null } },
          postCount: 1,
          authorName: '$authorDetails.name',
          authorEmail: '$authorDetails.email',
        },
      },
    ];

    const results = await Post.aggregate(pipeline);
    return res.status(200).json(results); // return plain array per request
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, 'Failed to fetch top authors (flat)'));
  }
};

module.exports = {
  getTopAuthors,
  getTopAuthorsFlat,
};

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { isDeleted: false } },
      { $addFields: { status: { $ifNull: ['$status', 'published'] }, contentLength: { $strLenCP: { $ifNull: ['$content', ''] } } } },
      {
        $facet: {
          totalStats: [
            { $group: { _id: null, totalPosts: { $sum: 1 }, avgContentLength: { $avg: '$contentLength' } } },
            { $project: { _id: 0, totalPosts: 1, avgContentLength: { $round: ['$avgContentLength', 2] } } },
          ],
          postsByStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } },
            { $sort: { count: -1 } },
          ],
          topAuthors: [
            { $group: { _id: '$author', postCount: { $sum: 1 } } },
            { $sort: { postCount: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'authorDetails' } },
            { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 0, authorId: { $convert: { input: '$_id', to: 'string', onError: null, onNull: null } }, postCount: 1, authorName: '$authorDetails.name', authorEmail: '$authorDetails.email' } },
          ],
          recentPosts: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'users', localField: 'author', foreignField: '_id', as: 'authorDetails' } },
            { $unwind: { path: '$authorDetails', preserveNullAndEmptyArrays: true } },
            { $project: { _id: 1, title: 1, createdAt: 1, status: 1, authorId: { $convert: { input: '$author', to: 'string', onError: null, onNull: null } }, authorName: '$authorDetails.name', authorEmail: '$authorDetails.email' } },
          ],
        },
      },
    ];

    const [result] = await Post.aggregate(pipeline);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    return next(new ApiError(500, 'Failed to fetch dashboard analytics'));
  }
};

module.exports.getDashboardAnalytics = getDashboardAnalytics;
