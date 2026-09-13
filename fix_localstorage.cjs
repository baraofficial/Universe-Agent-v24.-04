const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('bara_ai_room_messages', JSON\.stringify\(roomMessages\)\);\n\s*\}, \[roomMessages\]\);/;

const replacement = `useEffect(() => {
    try {
      // Keep only the last 50 messages for local storage to prevent QuotaExceededError
      const messagesToSave = roomMessages.length > 50 ? roomMessages.slice(roomMessages.length - 50) : roomMessages;
      localStorage.setItem('bara_ai_room_messages', JSON.stringify(messagesToSave));
    } catch (e) {
      console.error("Local storage quota exceeded, trying to save fewer messages", e);
      try {
        const messagesToSave = roomMessages.length > 10 ? roomMessages.slice(roomMessages.length - 10) : roomMessages;
        localStorage.setItem('bara_ai_room_messages', JSON.stringify(messagesToSave));
      } catch (err) {
        console.error("Still exceeding quota", err);
      }
    }
  }, [roomMessages]);`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
