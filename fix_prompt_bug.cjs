const fs = require('fs');

// Fix App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(
  /localStorage\.setItem\('bara_system_prompt', systemPrompt\);/g,
  "localStorage.setItem(STORAGE_KEY_PROMPT, systemPrompt);"
);
fs.writeFileSync('src/App.tsx', appContent);

// Fix server.ts model name just in case
let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(
  /model: "gemini-3\.6-flash"/g,
  'model: "gemini-2.5-flash"'
);
fs.writeFileSync('server.ts', serverContent);
