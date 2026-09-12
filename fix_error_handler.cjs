const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const targetStr = `  // Vite middleware for development`;

const replacement = `  // Error handler untuk route API (menghindari return HTML)
  app.use('/api', (err, req, res, next) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      responseText: "Waduh cak, terjadi kesalahan sistem: " + (err.message || 'Unknown Error'),
      toolUsed: "Error",
      status: "Gagal"
    });
  });

  // Vite middleware for development`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('server.ts', content);
