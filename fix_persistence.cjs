const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
  "const [roomMessages, setRoomMessages] = useState<any[]>([]);",
  `const [roomMessages, setRoomMessages] = useState<any[]>(() => {
    const saved = localStorage.getItem('bara_ai_room_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem('bara_ai_room_messages', JSON.stringify(roomMessages));
  }, [roomMessages]);`
);
fs.writeFileSync('src/App.tsx', content);
