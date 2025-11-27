const express = require('express');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/posts", require("./src/routes/posts.routes"));

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Blogify API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});