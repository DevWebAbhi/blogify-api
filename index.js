const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const cors = require('cors');
const errorHandler = require('./src/middlewares/errorHandler');
const cookieParser = require('cookie-parser');

// Environment variables
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// CORS Configuration
app.use(cors({ origin: '*', credentials: true }));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

// Routes
app.use('/api', require('./src/routes/post.routes'));
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/analytics', require('./src/routes/analytics.routes'));
app.use('/api/upload', require('./src/routes/upload.routes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
});

// Error handler (must be mounted after all routes)
app.use(errorHandler);

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });