const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(
  /const io = new Server\(server, \{\s*cors: \{ origin: "\*" \}\s*\}\);/g,
  `const io = new Server(server, {\n    cors: { origin: "*" },\n    maxHttpBufferSize: 50 * 1024 * 1024 // 50MB for large image data\n  });`
);
fs.writeFileSync('server.ts', content);
