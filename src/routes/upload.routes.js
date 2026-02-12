const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middlewares/auth.middleware');
const { uploadImage } = require('../controllers/upload.controller');

router.post('/', protect, upload.single('image'), uploadImage);

module.exports = router;
