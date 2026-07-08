const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Log directories content on boot
console.log(`Current __dirname: ${__dirname}`);
try {
  const files = fs.readdirSync(__dirname);
  console.log(`Files in __dirname: ${files.join(', ')}`);
} catch (err) {
  console.error(`Failed to list directory: ${err.message}`);
}

// Serve static assets with explicit MIME headers for ES modules compliance
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript');
    }
  }
}));

// Route main entrypoint
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  console.log(`GET / - Sending file: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: index.html does NOT exist at path: ${filePath}`);
    return res.status(404).send(`Error: index.html not found on server at ${filePath}`);
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Failed to send index.html: ${err.message}`);
      if (!res.headersSent) {
        res.status(500).send(`Server Error: ${err.message}`);
      }
    }
  });
});

// Route documentation
app.get('/README.md', (req, res) => {
  res.sendFile(path.join(__dirname, 'README.md'));
});

// SPA routing fallback to index.html
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) {
      res.status(404).send("Page not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`StadiumBrain AI server running on port ${PORT}`);
});
