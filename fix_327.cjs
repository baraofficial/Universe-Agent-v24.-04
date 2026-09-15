const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /    <\/>\n      \)\}\n    <\/>\n\nexport default function App\(\) \{\n/;
content = content.replace(regex, '    </>\n  );\n};\n\nexport default function App() {\n');

fs.writeFileSync('src/App.tsx', content);
