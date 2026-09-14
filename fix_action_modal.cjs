const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const actionMenuRegex = /\{actionMenuSessionId === session\.id && \([\s\S]*?<\/div>\s*\)\}/;
content = content.replace(actionMenuRegex, ""); // Remove the inline popup

// Now add a modal at the root level of the sidebar (or outside) for the action menu
const modalUI = `
      {/* Modal Aksi Riwayat Chat */}
      {actionMenuSessionId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setActionMenuSessionId(null)}>
          <div className="bg-[#141416] border border-primary-500/30 rounded-2xl w-full max-w-xs overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-primary-900/30 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-200 truncate">
                {chatSessions.find(s => s.id === actionMenuSessionId)?.title || "Opsi Obrolan"}
              </h2>
              <button onClick={() => setActionMenuSessionId(null)} className="text-gray-400 hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col">
              <button onClick={() => {
                const session = chatSessions.find(s => s.id === actionMenuSessionId);
                if (session) toggleStarSession(session.id);
                setActionMenuSessionId(null);
              }} className="w-full text-left px-5 py-4 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors border-b border-primary-900/20">
                <Star className={\`w-5 h-5 \${chatSessions.find(s => s.id === actionMenuSessionId)?.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}\`} /> 
                {chatSessions.find(s => s.id === actionMenuSessionId)?.isStarred ? 'Batal Bintang' : 'Bintangi'}
              </button>
              <button onClick={() => { handleShareSession(actionMenuSessionId); setActionMenuSessionId(null); }} className="w-full text-left px-5 py-4 text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 cursor-pointer transition-colors border-b border-primary-900/20">
                <Share2 className="w-5 h-5 text-blue-400" /> Bagikan
              </button>
              <button onClick={() => { deleteSession(actionMenuSessionId); setActionMenuSessionId(null); }} className="w-full text-left px-5 py-4 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 cursor-pointer transition-colors">
                <Trash2 className="w-5 h-5" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(/\{isDeleteRoomChatModalOpen && \(/, modalUI + "\n      {isDeleteRoomChatModalOpen && (");

fs.writeFileSync('src/App.tsx', content);
