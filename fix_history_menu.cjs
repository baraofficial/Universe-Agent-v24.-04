const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Add missing functions
const missingFunctions = `
const handleToggleStarSession = (id: string) => {
  setChatSessions(prev => prev.map(s => s.id === id ? { ...s, isStarred: !s.isStarred } : s));
};
const handleDeleteSession = (id: string) => {
  setChatSessions(prev => prev.filter(s => s.id !== id));
  if (currentSessionId === id) {
    setCurrentSessionId(null);
    setMessages([]);
  }
};
`;

if (!content.includes('handleToggleStarSession')) {
  content = content.replace('const handleShareSession = async (id: string) => {', missingFunctions + '\nconst handleShareSession = async (id: string) => {');
}

// Add Dropdown UI
const dropdownCode = `
                            {actionMenuSessionId === session.id && (
                              <div className="absolute right-0 top-10 w-40 bg-[#141416] border border-primary-500/30 rounded-xl shadow-2xl py-1 z-[60] animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => { handleToggleStarSession(session.id); setActionMenuSessionId(null); }} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                                  <Star className={\`w-3.5 h-3.5 \${session.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}\`} />
                                  {session.isStarred ? 'Hapus Bintang' : 'Bintangi'}
                                </button>
                                <button onClick={() => { handleShareSession(session.id); setActionMenuSessionId(null); }} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                                  <Share2 className="w-3.5 h-3.5" />
                                  Bagikan
                                </button>
                                <button onClick={() => { handleDeleteSession(session.id); setActionMenuSessionId(null); }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Hapus
                                </button>
                              </div>
                            )}
`;

content = content.replace(/<MoreVertical className="w-4 h-4" \/>\s*<\/button>/, '<MoreVertical className="w-4 h-4" />\n                            </button>\n' + dropdownCode);

fs.writeFileSync('src/App.tsx', content);
