let app;

try {
  app = require('../server/server.js');
} catch (err) {
  console.error("Vercel Serverless Init Error:", err);
  const express = require('express');
  app = express();
  app.use(express.json());
  app.all('*', (req, res) => {
    res.status(500).json({ 
      error: "Init Error", 
      message: err.message, 
      stack: err.stack 
    });
  });
}

module.exports = app;
