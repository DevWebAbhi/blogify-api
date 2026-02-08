const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();

const cors = require('cors');
// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api', require('./src/routes/post.routes'));
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/analytics', require('./src/routes/analytics.routes'));
// Upload routes
const uploadRoutes = require('./src/routes/upload.routes');
app.use('/api/upload', uploadRoutes);

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Blogify API" });
});

// Error handler (must be mounted after all routes)
const errorHandler = require('./src/middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI environment variable');
  process.exit(1);
}


mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });