const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const imgRegex = /https:\/\/i\.ibb\.co\/ynkrwj54\/Dr-Watermark-1789391792799-1\.jpg/g;
content = content.replace(imgRegex, '/bara-ai-logo.jpg');

fs.writeFileSync('src/App.tsx', content);
