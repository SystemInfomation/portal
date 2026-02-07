const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import security middleware
const { 
  authenticateApiKey, 
  validateAnnouncement, 
  filterAndSanitize, 
  generalLimit, 
  adminLimit,
  logSecurityEvent 
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://forsyth-county.github.io/portal/',
  credentials: false
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all routes
app.use(generalLimit);

// In-memory storage for announcements (you can replace with a database)
let announcements = {
  current: {
    message: "",
    type: "info",
    timestamp: 0,
    id: "",
    enabled: false
  }
};

// GET /api/announcements - Fetch current announcement (public endpoint)
app.get('/api/announcements', (req, res) => {
  res.json(announcements.current);
});

// POST /api/announcements - Create/update announcement (protected endpoint)
app.post('/api/announcements', 
  authenticateApiKey,
  adminLimit,
  validateAnnouncement,
  filterAndSanitize,
  (req, res) => {
    const { message, type, enabled } = req.body;
    
    const newAnnouncement = {
      message: message.trim(),
      type: type || 'info',
      timestamp: Date.now(),
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      enabled: enabled !== false
    };
    
    announcements.current = newAnnouncement;
    
    // Log successful announcement creation
    logSecurityEvent('ANNOUNCEMENT_CREATED', {
      id: newAnnouncement.id,
      type: newAnnouncement.type,
      messageLength: newAnnouncement.message.length
    });
    
    res.json({
      success: true,
      announcement: newAnnouncement
    });
  }
);

// DELETE /api/announcements - Disable current announcement (protected endpoint)
app.delete('/api/announcements', 
  authenticateApiKey,
  adminLimit,
  (req, res) => {
    const oldAnnouncement = { ...announcements.current };
    
    announcements.current.enabled = false;
    announcements.current.message = "";
    
    // Log announcement deletion
    logSecurityEvent('ANNOUNCEMENT_DISABLED', {
      previousId: oldAnnouncement.id,
      previousType: oldAnnouncement.type
    });
    
    res.json({
      success: true,
      message: 'Announcement disabled'
    });
  }
);

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logSecurityEvent('SERVER_ERROR', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });
  
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  logSecurityEvent('NOT_FOUND', {
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Secure announcement server running on port ${PORT}`);
  console.log(`� Security features enabled:`);
  console.log(`   - API Key Authentication`);
  console.log(`   - Rate Limiting`);
  console.log(`   - Content Filtering`);
  console.log(`   - Input Validation`);
  console.log(`   - XSS Protection`);
  console.log(`�📢 API endpoints available:`);
  console.log(`   GET  /api/announcements - Fetch current announcement`);
  console.log(`   POST /api/announcements - Create/update announcement (protected)`);
  console.log(`   DELETE /api/announcements - Disable announcement (protected)`);
  console.log(`   GET  /api/health - Health check`);
});

module.exports = app;
