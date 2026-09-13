const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add Share2 to imports
content = content.replace(/Trash2,/, 'Trash2, Share2,');

// Add handleShareSession function
const shareFunc = `const handleShareSession = async (id: string) => {
  const session = chatSessions.find(s => s.id === id);
  if (!session) return;
  const text = session.messages.map(m => \`\${m.sender === 'user' ? (userName || 'User') : 'Bara AI'}: \${m.text}\`).join('\\n\\n');
  if (navigator.share) {
    try {
      await navigator.share({ title: session.title, text: text });
    } catch (e) {
      console.log('Error sharing', e);
    }
  } else {
    navigator.clipboard.writeText(text);
    alert('Percakapan disalin ke clipboard!');
  }
  setActionMenuSessionId(null);
};

const deleteSession`;

content = content.replace(/const deleteSession/g, shareFunc);

// Update menu rendering
const menuCodeRegex = /<button onClick=\{\(\) => toggleStarSession\(session\.id\)\} className="w-full text-left px-3 py-2\.5 text-sm text-gray-300 hover:bg-white\/5 flex items-center gap-2 cursor-pointer transition-colors">\s*<Star className=\{\`w-4 h-4 \$\{session\.isStarred \? 'fill-yellow-400 text-yellow-400' : ''\}\`\} \/> \{session\.isStarred \? 'Batal Bintang' : 'Bintangi'\}\s*<\/button>\s*<button onClick=\{\(\) => deleteSession\(session\.id\)\} className="w-full text-left px-3 py-2\.5 text-sm text-red-400 hover:bg-white\/5 flex items-center gap-2 cursor-pointer transition-colors">\s*<Trash2 className="w-4 h-4" \/> Hapus\s*<\/button>/;

const newMenuCode = `<button onClick={() => handleShareSession(session.id)} className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors">
                                  <Share2 className="w-4 h-4" /> Bagikan
                                </button>
                                <button onClick={() => deleteSession(session.id)} className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors">
                                  <Trash2 className="w-4 h-4" /> Hapus
                                </button>
                                <button onClick={() => toggleStarSession(session.id)} className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors">
                                  <Star className={\`w-4 h-4 \${session.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}\`} /> {session.isStarred ? 'Batal Bintang' : 'Bintangi'}
                                </button>`;

content = content.replace(menuCodeRegex, newMenuCode);

// Also need to make sure opacity-0 group-hover:opacity-100 on mobile is accessible.
// Usually users can't hover on mobile. So we shouldn't hide the 3-dots on mobile, or we use something like opacity-100 md:opacity-0 md:group-hover:opacity-100.
// Let's modify the three-dots button's class.
content = content.replace(/opacity-0 group-hover:opacity-100/g, 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100');

fs.writeFileSync('src/App.tsx', content);
