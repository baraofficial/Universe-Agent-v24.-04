const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: textToSend.trim(), history: messages, systemPrompt })
      });

      const result = await response.json();`;

const replacement = `      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: textToSend.trim(), history: messages, systemPrompt })
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const textError = await response.text();
        throw new Error("Respons server bukan JSON (Error: " + response.status + "). Detail: " + textError.substring(0, 50));
      }`;

content = content.replace(targetStr, replacement);
fs.writeFileSync('src/App.tsx', content);
