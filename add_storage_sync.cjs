const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /useEffect\(\(\) => \{\n\s*localStorage\.setItem\('bara_ai_room_messages', JSON\.stringify\(roomMessages\)\);\n\s*\}, \[roomMessages\]\);/;
const replacement = `useEffect(() => {
    localStorage.setItem('bara_ai_room_messages', JSON.stringify(roomMessages));
  }, [roomMessages]);

  // Sync state across multiple tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'bara_ai_room_messages' && e.newValue) {
        try {
          setRoomMessages(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
