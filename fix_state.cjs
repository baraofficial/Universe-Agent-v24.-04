const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /\/\/ --- STATE THEME & MODALS ---/;
const replacement = `const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    return localStorage.getItem('bara_user_avatar') || null;
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [copiedAiMessageId, setCopiedAiMessageId] = useState<string | null>(null);

  // --- STATE THEME & MODALS ---`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
