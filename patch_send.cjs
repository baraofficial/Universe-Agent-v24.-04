const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const messageRegex = /const newUserMessage: ChatMessage = \{\n\s*id: \`user-\$\{Date\.now\(\)\}\`,\n\s*sender: 'user',\n\s*text: textToSend\.trim\(\),\n\s*timestamp: timestampNow\n\s*\};/;

const newMessage = `const newUserMessage: ChatMessage = {
      id: \`user-\$\{Date.now()\}\`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: timestampNow,
      file: selectedFile ? { name: selectedFile.name, dataUrl: selectedFile.dataUrl, type: selectedFile.type } : undefined
    };`;
    
if (content.match(messageRegex)) {
    content = content.replace(messageRegex, newMessage);
} else {
    console.log("No match for newUserMessage");
}

const apiCallRegex = /body: JSON\.stringify\(\{\n\s*prompt: textToSend\.trim\(\),\n\s*history: messages,\n\s*systemPrompt\n\s*\}\)/;
const newApiCall = `body: JSON.stringify({
          prompt: textToSend.trim(),
          history: messages,
          systemPrompt,
          file: selectedFile ? { dataUrl: selectedFile.dataUrl, mimeType: selectedFile.type } : undefined
        })`;
        
if (content.match(apiCallRegex)) {
    content = content.replace(apiCallRegex, newApiCall);
} else {
    console.log("No match for API call");
}

// Clear selected file after send
const isThinkingRegex = /setIsThinking\(true\);/;
content = content.replace(isThinkingRegex, 'setSelectedFile(null);\n    setIsThinking(true);');


fs.writeFileSync('src/App.tsx', content);
