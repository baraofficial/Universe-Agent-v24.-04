const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add ChatSession interface
content = content.replace(
  /interface ChatMessage \{/,
  `interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  isStarred: boolean;
}

interface ChatMessage {`
);

// 2. Add chatSessions state and currentSessionId
const stateInsertRegex = /const \[messages, setMessages\] = useState<ChatMessage\[\]>\(\(\) => \{[\s\S]*?\}\);/;
const stateReplacement = `const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
  const saved = localStorage.getItem('bara_chat_sessions');
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [];
});
const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
const [actionMenuSessionId, setActionMenuSessionId] = useState<string | null>(null);
const [isStarredSessionsOpen, setIsStarredSessionsOpen] = useState(false);

const [messages, setMessages] = useState<ChatMessage[]>(() => {
  const saved = localStorage.getItem(STORAGE_KEY_CHAT);
  if (saved) {
    try { return JSON.parse(saved); } catch {}
  }
  return [
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Halo cak! Ada yang bisa dibantu hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      toolUsed: 'Umum'
    }
  ];
});

useEffect(() => {
  localStorage.setItem('bara_chat_sessions', JSON.stringify(chatSessions));
}, [chatSessions]);

useEffect(() => {
  if (currentSessionId && messages.length > 0) {
    setChatSessions(prev => prev.map(s => 
      s.id === currentSessionId ? { ...s, messages: messages, updatedAt: Date.now() } : s
    ));
  }
}, [messages, currentSessionId]);

const deleteSession = (id: string) => {
  setChatSessions(prev => prev.filter(s => s.id !== id));
  if (currentSessionId === id) {
    handleClearChat();
  }
  setActionMenuSessionId(null);
};

const toggleStarSession = (id: string) => {
  setChatSessions(prev => prev.map(s => s.id === id ? { ...s, isStarred: !s.isStarred } : s));
  setActionMenuSessionId(null);
};

const handleSelectSession = (id: string) => {
  const session = chatSessions.find(s => s.id === id);
  if (session) {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    setChatMode('ai');
    setIsTopMenuOpen(false);
  }
};
`;
content = content.replace(stateInsertRegex, stateReplacement);

// 3. Update handleClearChat to clear session
content = content.replace(
  /setMessages\(defaultWelcome\);\n\s*localStorage\.removeItem\(STORAGE_KEY_CHAT\);/,
  `setMessages(defaultWelcome);
    setCurrentSessionId(null);
    localStorage.removeItem(STORAGE_KEY_CHAT);`
);

// 4. Update handleSendCommand
const sendCommandRegex = /const newMessagesList = \[\.\.\.messages, newUserMessage\];\n\s*setMessages\(newMessagesList\);\n\s*setInputCommand\(''\);\n\s*setIsThinking\(true\);/;
const sendCommandReplacement = `const newMessagesList = [...messages, newUserMessage];
    setMessages(newMessagesList);
    
    if (!currentSessionId) {
      const newSessionId = \`session-\${Date.now()}\`;
      const newSession: ChatSession = {
        id: newSessionId,
        title: textToSend.trim().substring(0, 30) + (textToSend.length > 30 ? '...' : ''),
        messages: newMessagesList,
        updatedAt: Date.now(),
        isStarred: false
      };
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSessionId);
    }

    setInputCommand('');
    setIsThinking(true);`;
content = content.replace(sendCommandRegex, sendCommandReplacement);


// 5. Update left sidebar UI
const sidebarRegex = /<button \n\s*onClick=\{\(\) => \{\n\s*handleClearChat\(\);\n\s*setIsTopMenuOpen\(false\);\n\s*\}\}\n\s*className="w-full mt-2 text-left px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium shadow-lg"\n\s*>\n\s*<Plus className="w-5 h-5" \/>\n\s*New Chat\n\s*<\/button>\n\s*\)\}/;

const sidebarReplacement = `<button 
                        onClick={() => {
                          handleClearChat();
                          setIsTopMenuOpen(false);
                        }}
                        className="w-full mt-2 text-left px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        New Chat
                      </button>
                    )}

                    {chatMode === 'ai' && chatSessions.length > 0 && (
                      <div className="mt-4 flex flex-col gap-2 overflow-y-auto max-h-[40vh] pr-1 pb-4">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Riwayat Chat</div>
                        {chatSessions.map(session => (
                          <div key={session.id} onClick={() => handleSelectSession(session.id)} className="group relative flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                            <div className="flex items-center gap-2 overflow-hidden flex-1">
                              <MessageSquare className="w-4 h-4 text-gray-400 shrink-0" />
                              <span className={\`text-sm truncate \${currentSessionId === session.id ? 'text-primary-300 font-medium' : 'text-gray-300'}\`}>
                                {session.title}
                              </span>
                            </div>
                            
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActionMenuSessionId(actionMenuSessionId === session.id ? null : session.id);
                              }}
                              className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {actionMenuSessionId === session.id && (
                              <div className="absolute right-8 top-8 w-40 bg-[#1A1A24] border border-primary-500/30 rounded-xl shadow-2xl z-[60] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                                <button onClick={() => toggleStarSession(session.id)} className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                                  <Star className={\`w-4 h-4 \${session.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}\`} /> {session.isStarred ? 'Batal Bintang' : 'Bintangi'}
                                </button>
                                <button onClick={() => deleteSession(session.id)} className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                                  <Trash2 className="w-4 h-4" /> Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    }`;

content = content.replace(sidebarRegex, sidebarReplacement);

fs.writeFileSync('src/App.tsx', content);
