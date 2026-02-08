const express = require('express');
const { getTopAuthors, getTopAuthorsFlat } = require('../controllers/analytics.controller');
const { getDashboardAnalytics } = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/top-authors', getTopAuthors);
router.get('/top-authors/flat', getTopAuthorsFlat);
router.get('/dashboard', getDashboardAnalytics);

module.exports = router;
