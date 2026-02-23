# Deployment Checklist

A comprehensive guide to ensure your Blogify API is production-ready before deployment.

## Pre-Deployment Verification

### Environment Variables
- [ ] `MONGO_URI` - MongoDB Atlas connection string is configured
- [ ] `JWT_SECRET` - Strong random secret is generated and set
- [ ] `JWT_EXPIRES_IN` - Token expiration time is set (default: 7d)
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name is configured
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key is configured
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret is configured
- [ ] `NODE_ENV` - Set to `production`
- [ ] `ALLOWED_ORIGINS` - Frontend URLs are specified (comma-separated)
- [ ] `PORT` - Optional, defaults to 3000

### Security Review
- [ ] JWT secret is cryptographically secure
  - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] CORS is configured with specific domains, not wildcards in production
- [ ] `.env` file is in `.gitignore` and NOT committed to repository
- [ ] `.env.example` is committed with placeholder values
- [ ] Cloudinary credentials are rotated if previously exposed
- [ ] No sensitive data is logged in production
- [ ] Error messages don't expose implementation details
- [ ] All input validation is properly implemented

### Database
- [ ] MongoDB Atlas cluster is created
- [ ] IP whitelist includes deployment server's IP
- [ ] Database backups are enabled
- [ ] Database indexes are created for performance
- [ ] MongoDB user has minimal required permissions

### API Testing
- [ ] All endpoints tested with valid inputs
- [ ] All endpoints tested with invalid inputs
- [ ] Authentication endpoints (signup, login) work correctly
- [ ] Protected endpoints require valid JWT tokens
- [ ] Role-based authorization is working
- [ ] Post CRUD operations work correctly
- [ ] Image uploads to Cloudinary work correctly
- [ ] Analytics endpoints return correct data
- [ ] Health check endpoint `/health` responds correctly
- [ ] 404 errors are handled properly

### Performance
- [ ] Response times are acceptable (< 200ms for most endpoints)
- [ ] Database queries are optimized
- [ ] No N+1 query problems detected
- [ ] Mongoose connection pooling is configured
- [ ] Memory usage is within acceptable limits

### Monitoring & Logging
- [ ] Error tracking is configured (e.g., Sentry)
- [ ] Request logging is enabled for production
- [ ] Graceful shutdown handlers are working
- [ ] Process managers (PM2, systemd, Docker) are configured
- [ ] Log rotation is configured if using file logging

### Docker (if applicable)
- [ ] Dockerfile is created and tested locally
- [ ] Docker image builds successfully
- [ ] All environment variables are passed correctly
- [ ] Container starts and runs without errors
- [ ] Container logs are accessible

### Final Checks
- [ ] Source code is committed and pushed to main/production branch
- [ ] No console.log debugging statements remain
- [ ] Dependencies are up to date (check for security vulnerabilities)
- [ ] README.md is updated with deployment instructions
- [ ] Application README includes all required environment variables

## Deployment Steps

### Render Deployment

1. **Connect GitHub Repository**
   - Go to [render.com](https://render.com)
   - Create a new Web Service
   - Select your GitHub repository and main branch

2. **Configure Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Node Version: 18.0.0 or higher

3. **Set Environment Variables**
   - Add all required environment variables from the checklist above

4. **Deploy**
   - Trigger deployment by pushing to main branch
   - Monitor deployment logs for errors

5. **Verify Deployment**
   - [ ] `/health` endpoint returns 200 status
   - [ ] `/` endpoint returns welcome message
   - [ ] Authentication endpoints are accessible
   - [ ] Error handling is working correctly

### Manual/Other Deployment

1. **Install Dependencies**
   ```bash
   npm install --production
   ```

2. **Start Server**
   ```bash
   NODE_ENV=production npm start
   ```

3. **Verify Server**
   - Check logs for successful MongoDB connection
   - Verify all logs show production environment
   - Test health endpoint via curl or Postman

## Post-Deployment

### Monitoring
- [ ] Monitor error rates and response times
- [ ] Watch for unusual database query patterns
- [ ] Check for memory leaks after extended runtime
- [ ] Monitor file system and disk usage

### Maintenance
- [ ] Set up regular database backups
- [ ] Plan for security updates
- [ ] Monitor dependency vulnerabilities
- [ ] Schedule regular performance reviews

### Emergency Procedures
- [ ] Document rollback procedure
- [ ] Have updated MongoDB connection string backed up
- [ ] Know how to quickly revert via git
- [ ] Have process restart documentation

## Troubleshooting

### Common Deployment Issues

**MongoDB Connection Fails**
- Verify MongoDB Atlas IP whitelist includes deployment server
- Check MongoDB connection string format
- Ensure credentials are correct

**Authentication Fails**
- Verify JWT_SECRET is identical across all deployments
- Check token expiration settings
- Ensure cookies are properly configured

**Cloudinary Upload Fails**
- Verify Cloudinary credentials
- Check file size limits in multer config
- Ensure upload folder exists in Cloudinary

**CORS Issues**
- Verify ALLOWED_ORIGINS includes frontend domain
- Check that frontend is making requests to correct API URL
- Ensure credentials mode matches CORS configuration

## Sign-Off

- [ ] Developer: Deployment checklist reviewed by development team
- [ ] QA: Testing completed and verified
- [ ] DevOps/Deployment: Infrastructure is ready
- [ ] Deployment timestamp: _______________
- [ ] Who deployed: _______________
