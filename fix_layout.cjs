const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  /<div className=\{\`h-screen overflow-hidden bg-\[\#0A0A0A\] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-\$\{theme\}\`\}>/,
  `<div className={\`fixed inset-0 overflow-hidden bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-\${theme}\`}>`
);
fs.writeFileSync('src/App.tsx', content);
