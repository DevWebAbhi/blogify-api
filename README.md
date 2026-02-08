# Blogify API

A production-ready blog management API built with Express.js and MongoDB.

## Features

- 📝 Blog post management (CRUD operations)
- 👤 User authentication with JWT
- 📊 Analytics tracking
- 📤 Image upload with Cloudinary
- 🔐 Role-based authorization
- 📱 RESTful API endpoints
- 🌐 CORS enabled for cross-origin requests

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB account (MongoDB Atlas)
- Cloudinary account (optional, for image uploads)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blogify-api
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file based on `.env.example`
```bash
cp .env.example .env
```

4. Update `.env` with your credentials

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | No (default: 7d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No |
| `NODE_ENV` | Environment (production/development) | No |
| `PORT` | Server port | No (default: 3000) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | No (default: *) |

## Development

```bash
npm run dev
```

Starts the server with hot-reload using nodemon.

## Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated)
- `DELETE /api/posts/:id` - Delete post (authenticated)

### Upload
- `POST /api/upload` - Upload image to Cloudinary

### Analytics
- `GET /api/analytics/stats` - Get analytics data

### Health
- `GET /` - Welcome message
- `GET /health` - Health check

## Deployment on Render

### 1. Connect Repository to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Select the `main` branch

### 2. Configure Environment Variables

In Render Dashboard, add these environment variables:

- `MONGO_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - A strong random secret (generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `ALLOWED_ORIGINS` - Your frontend URLs (comma-separated)
- `NODE_ENV` - Set to `production`

### 3. Configure Build & Start Commands

- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 4. Deploy

Push your changes to the `main` branch. Render will automatically deploy your application.

## Security Recommendations

1. **JWT Secret**: Generate a strong random secret
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **CORS**: In production, set `ALLOWED_ORIGINS` to specific domains only

3. **Environment Variables**: Never commit `.env` file. Use `.env.example` for documentation

4. **Sensitive Data**: Rotate Cloudinary credentials periodically

5. **Input Validation**: All endpoints validate input data

6. **Error Handling**: Errors don't expose sensitive information

## Monitoring

The application includes:
- Graceful shutdown handling (SIGTERM/SIGINT)
- Uncaught exception handling
- Unhandled rejection handling
- Request logging in production
- Health check endpoint at `/health`

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` is correct
- Check IP whitelist in MongoDB Atlas
- Ensure network connectivity

### JWT Authentication Fails
- Verify `JWT_SECRET` is set and consistent across deployments
- Check token expiration time

### Cloudinary Upload Fails
- Verify Cloudinary credentials
- Check file size limits in configuration

### CORS Issues
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- For development, set to `*`

## License

ISC
