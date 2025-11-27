// Get all posts

const dummyPosts = [
    {
      id: 1,
      title: "Getting Started with Node.js",
      description: "Learn the basics of Node.js and how to build server-side applications",
      author: "John Doe",
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
      content: "Node.js is a powerful JavaScript runtime built on Chrome's V8 engine..."
    },
    {
      id: 2,
      title: "Express.js Best Practices",
      description: "Explore best practices for building robust Express.js applications",
      author: "Jane Smith",
      createdAt: new Date("2025-01-20"),
      updatedAt: new Date("2025-01-22"),
      content: "Express.js is a minimal and flexible Node.js web application framework..."
    },
    {
      id: 3,
      title: "Database Design Tips",
      description: "Essential tips for designing scalable and efficient databases",
      author: "Mike Johnson",
      createdAt: new Date("2025-02-01"),
      updatedAt: new Date("2025-02-03"),
      content: "Good database design is crucial for application performance..."
    }
  ];



const getAllPosts = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    data: dummyPosts
  });
};

module.exports = {
  getAllPosts
};
