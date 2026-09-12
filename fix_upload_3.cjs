const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleSendRoomMessage = \(text: string, file\?: any\) => \{\s*if \(!text\.trim\(\) && !file\) return;/;
const replacement = `const handleSendRoomMessage = (text: string) => {
    if (!text.trim() && !selectedFile) return;`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
