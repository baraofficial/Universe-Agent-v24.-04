const fs = require('fs');
let content = fs.readFileSync('api/chat.ts', 'utf8');

const regex = /const \{ prompt, history, systemPrompt \} = req\.body;/;
content = content.replace(regex, 'const { prompt, history, systemPrompt, file } = req.body;');

const genContentRegex = /contents: promptWithContext,/;
const newGenContent = `contents: file ? [
          { text: promptWithContext },
          { inlineData: { data: file.dataUrl.split(',')[1], mimeType: file.mimeType } }
        ] : promptWithContext,`;

content = content.replace(genContentRegex, newGenContent);
content = content.replace(/"gemini-3\.6-flash"/g, '"gemini-2.5-flash"');
fs.writeFileSync('api/chat.ts', content);
