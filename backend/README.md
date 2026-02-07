# Forsyth Portal Backend

## Overview

This is a simple Express.js backend that provides a real-time API for managing announcements on the Forsyth County Portal. It's designed to be deployed on Render and work with the static GitHub Pages frontend.

## Features

- ✅ **RESTful API**: Clean endpoints for announcement management
- ✅ **Real-time Updates**: Frontend polls every 15 seconds for new announcements
- ✅ **CORS Support**: Configured for GitHub Pages frontend
- ✅ **Security**: Helmet.js for security headers
- ✅ **Health Check**: Monitoring endpoint for deployment health

## API Endpoints

### GET /api/announcements
Fetch the current announcement.

**Response:**
```json
{
  "message": "Your announcement here",
  "type": "info",
  "timestamp": 1707078000000,
  "id": "ann_1234567890_abc123",
  "enabled": true
}
```

### POST /api/announcements
Create or update an announcement.

**Request Body:**
```json
{
  "message": "New announcement message",
  "type": "success",
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "announcement": {
    "message": "New announcement message",
    "type": "success",
    "timestamp": 1707078000000,
    "id": "ann_1234567890_abc123",
    "enabled": true
  }
}
```

### DELETE /api/announcements
Disable the current announcement.

**Response:**
```json
{
  "success": true,
  "message": "Announcement disabled"
}
```

### GET /api/health
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "ok",
  "timestamp": 1707078000000,
  "uptime": 3600.123
}
```

## Deployment on Render

1. **Create a new Web Service** on Render
2. **Connect your GitHub repository** (or upload the backend folder)
3. **Configure the service:**
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Port**: 3001 (or whatever you set in PORT env var)

4. **Set Environment Variables:**
   - `PORT=3001`
   - `FRONTEND_URL=https://yourusername.github.io`

5. **Deploy!** Render will give you a URL like `https://your-app.onrender.com`

## Frontend Configuration

Update your frontend environment variable:

```env
NEXT_PUBLIC_ANNOUNCEMENT_API_URL=https://your-app.onrender.com/api/announcements
```

## Local Development

1. Copy `.env.example` to `.env`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Security Notes

- The API is currently open for simplicity
- For production, consider adding authentication
- Use environment variables for sensitive configuration
- Monitor the `/api/health` endpoint for uptime

## Database Integration

Currently uses in-memory storage. For production, consider:
- MongoDB with Mongoose
- PostgreSQL with Sequelize
- Redis for caching
- Render's PostgreSQL add-on

## Testing the API

```bash
# Get current announcement
curl https://your-app.onrender.com/api/announcements

# Create new announcement
curl -X POST https://your-app.onrender.com/api/announcements \
  -H "Content-Type: application/json" \
  -d '{"message":"Test announcement","type":"info","enabled":true}'

# Disable announcement
curl -X DELETE https://your-app.onrender.com/api/announcements
```
