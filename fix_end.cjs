const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/ \)\}\n\n<\/div>\n \);\n\}\n\n/, ' )}\n    </div>\n   )}\n  </>\n  );\n}');

fs.writeFileSync('src/App.tsx', content);
