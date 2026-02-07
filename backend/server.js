const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

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

// GET /api/announcements - Fetch current announcement
app.get('/api/announcements', (req, res) => {
  res.json(announcements.current);
});

// POST /api/announcements - Create/update announcement
app.post('/api/announcements', (req, res) => {
  const { message, type, enabled } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (!['info', 'warning', 'success'].includes(type)) {
    return res.status(400).json({ error: 'Type must be info, warning, or success' });
  }
  
  const newAnnouncement = {
    message,
    type: type || 'info',
    timestamp: Date.now(),
    id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    enabled: enabled !== false
  };
  
  announcements.current = newAnnouncement;
  
  res.json({
    success: true,
    announcement: newAnnouncement
  });
});

// DELETE /api/announcements - Disable current announcement
app.delete('/api/announcements', (req, res) => {
  announcements.current.enabled = false;
  announcements.current.message = "";
  
  res.json({
    success: true,
    message: 'Announcement disabled'
  });
});

// GET /api/health - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Announcement server running on port ${PORT}`);
  console.log(`📢 API endpoints available:`);
  console.log(`   GET  /api/announcements - Fetch current announcement`);
  console.log(`   POST /api/announcements - Create/update announcement`);
  console.log(`   DELETE /api/announcements - Disable announcement`);
  console.log(`   GET  /api/health - Health check`);
});

module.exports = app;
