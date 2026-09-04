import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """              {isTopMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsTopMenuOpen(false)}></div>
                  <div className="absolute left-0 top-full mt-2 w-48 bg-[#120D22] border border-primary-900/50 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in py-1">
                    <button 
                      onClick={handleSaveChatFile}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-primary-900/30 hover:text-primary-300 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Simpan Chat
                    </button>
                    <button 
                      onClick={() => {
                        handleClearChat();
                        setIsTopMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-primary-900/30 hover:text-primary-300 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      New Chat
                    </button>
                  </div>
                </>
              )}"""

replacement = """              {isTopMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsTopMenuOpen(false)}></div>
                  <div className="fixed inset-y-0 left-0 w-72 bg-[#0E0E12] border-r border-primary-900/50 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
                    <div className="p-4 border-b border-primary-900/30 flex items-center justify-between">
                      <h2 className="text-lg font-orbitron font-bold text-primary-400">Riwayat Chat</h2>
                      <button onClick={() => setIsTopMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </div>
                    
                    <div className="p-4 flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          handleClearChat();
                          setIsTopMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        New Chat
                      </button>
                      
                      <button 
                        onClick={handleSaveChatFile}
                        className="w-full text-left px-4 py-3 rounded-xl border border-primary-900/50 bg-primary-900/10 hover:bg-primary-900/30 text-primary-300 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <Download className="w-5 h-5" />
                        Simpan Chat (.md)
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 border-t border-primary-900/30">
                       <h3 className="text-xs font-mono text-gray-500 mb-3 uppercase tracking-wider">Sesi Saat Ini</h3>
                       <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-primary-400 shrink-0" />
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm text-gray-200 truncate">{messages[messages.length - 1]?.text || 'Percakapan baru...'}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{messages.length} pesan dalam sesi ini</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </>
              )}"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Sidebar updated.")
else:
    print("Target not found. Let's try Regex")
    pattern = re.compile(r'\{\s*isTopMenuOpen && \(\s*<>\s*<div className="fixed inset-0 z-40".*?</div>\s*</>\s*\)\s*\}', re.DOTALL)
    if pattern.search(content):
        content = pattern.sub(replacement, content)
        with open("src/App.tsx", "w") as f:
            f.write(content)
        print("Sidebar updated via regex.")
    else:
        print("REGEX FAILED.")
