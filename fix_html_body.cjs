const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');
content = content.replace(
  /<body class="(.*?)">/,
  '<body class="$1 fixed inset-0 overflow-hidden">'
);
fs.writeFileSync('index.html', content);
