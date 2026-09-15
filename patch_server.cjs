const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /const \{ prompt, history, systemPrompt \} = req\.body;/;
content = content.replace(regex, 'const { prompt, history, systemPrompt, file } = req.body;');

const genContentRegex = /contents: promptWithContext,/;
const newGenContent = `contents: file ? [
              { text: promptWithContext },
              { inlineData: { data: file.dataUrl.split(',')[1], mimeType: file.mimeType } }
            ] : promptWithContext,`;

content = content.replace(genContentRegex, newGenContent);
fs.writeFileSync('server.ts', content);
