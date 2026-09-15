const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/max-h-64/g, 'max-h-32');

fs.writeFileSync('src/App.tsx', content);
