const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

router.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
  });
});

module.exports = router;