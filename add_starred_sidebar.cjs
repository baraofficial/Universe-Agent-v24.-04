const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const settingsTarget = /\{\/\* Edit Username \*\/\}/;
const settingsReplacement = `
              {/* Pesan Berbintang */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    setIsStarredSessionsOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-primary-900/10 border border-primary-500/30 hover:bg-primary-900/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-200">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                    Pesan Berbintang
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
              {/* Edit Username */}`;

content = content.replace(settingsTarget, settingsReplacement);

const starredSidebarTarget = /\{\/\* Starred Messages Sidebar \*\/\}/;
const starredSidebarReplacement = `
      {/* Starred Sessions Sidebar (AI Chat) */}
      {isStarredSessionsOpen && chatMode === 'ai' && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsStarredSessionsOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-80 bg-[#09090b] border-l border-primary-500/30 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-4 border-b border-primary-900/30 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-orbitron font-bold text-yellow-400 flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                Pesan Berbintang
              </h2>
              <button onClick={() => setIsStarredSessionsOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {chatSessions.filter(s => s.isStarred).length === 0 ? (
                <div className="text-center text-gray-500 text-sm mt-10">Belum ada pesan yang dibintangi.</div>
              ) : (
                chatSessions.filter(s => s.isStarred).map(session => (
                  <div key={session.id} className="bg-[#1A1A24] border border-primary-900/40 rounded-xl p-3 flex flex-col gap-2 relative">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm text-gray-200 font-medium line-clamp-2">{session.title}</div>
                      <button 
                        onClick={() => toggleStarSession(session.id)}
                        className="p-1 text-yellow-400 hover:bg-white/10 rounded-lg shrink-0 cursor-pointer"
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500 font-mono">{new Date(session.updatedAt).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}</span>
                      <button 
                        onClick={() => {
                          handleSelectSession(session.id);
                          setIsStarredSessionsOpen(false);
                        }}
                        className="text-xs text-primary-400 hover:text-primary-300 cursor-pointer font-medium"
                      >
                        Buka Chat
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Starred Messages Sidebar */}`;

content = content.replace(starredSidebarTarget, starredSidebarReplacement);

fs.writeFileSync('src/App.tsx', content);
