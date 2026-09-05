import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """      <header className="border-b border-primary-900/50 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
                 <div className="flex items-center gap-3">
            
            <div className="relative">
              <button 
                onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
                className="p-2 -ml-2 rounded-xl bg-primary-900/10 text-primary-400 hover:bg-primary-900/30 hover:text-primary-300 transition-colors cursor-pointer"
                title="Menu"
              >
                <MoreVertical className="w-6 h-6" />
              </button>
              
              {isTopMenuOpen && (
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
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative bg-[#140F2A] border border-primary-500/50 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#130E24] border border-primary-500/40 shadow-[0_0_15px_rgba(var(--primary-600),0.15)]">
                <h1 className="text-base sm:text-lg font-black tracking-wider text-primary-400 font-orbitron glow-primary-text">
                  Bara AI
                </h1>
                <div className="hidden sm:flex items-center gap-2 border-l border-primary-900/50 pl-2 ml-1">
                  <p className="text-[10px] text-primary-300/70 font-mono">
                    [SYSTEM ONLINE]
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#130E24] border border-primary-500/40 ">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 glow-green-sm"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide font-mono">
                Agent: Online
              </span>
            </div>
            
            <button 
              onClick={() => setIsSettingsMenuOpen(true)}
              className="p-2 rounded-xl bg-primary-900/20 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </header>"""

replacement = """      <header className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-transparent">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="relative w-12 h-12 flex items-center justify-start">
            <button 
              onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-1 items-center justify-center w-4 h-4">
                <span className={`block h-[1.5px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? 'rotate-45 translate-y-[5.5px]' : ''}`}></span>
                <span className={`block h-[1.5px] w-full bg-current transition duration-300 ease-in-out ${isTopMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-[1.5px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? '-rotate-45 -translate-y-[5.5px]' : ''}`}></span>
              </div>
            </button>

            {isTopMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsTopMenuOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 w-72 bg-[#09090b] border-r border-primary-500/30 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
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
                </div>
              </>
            )}
          </div>

          <div className="flex-1 flex justify-center">
            <div className="px-6 py-2 rounded-full border border-primary-500/40 bg-[#120F1D]/50 flex items-center justify-center">
              <h1 className="text-sm font-bold tracking-widest text-primary-400 font-mono uppercase">
                Bara AI
              </h1>
            </div>
          </div>

          <div className="w-12 h-12 flex items-center justify-end">
            <button 
              onClick={() => setIsSettingsMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </header>"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Header UI rewrite completed!")
else:
    print("Target not found. Let's do regex replace.")
    # More robust regex replacement for the header
    pattern = re.compile(r'<header className="border-b border-primary-900/50 bg-\[#0A0A0A\]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3\.5">.*?</header>', re.DOTALL)
    if pattern.search(content):
        content = pattern.sub(replacement, content)
        with open("src/App.tsx", "w") as f:
            f.write(content)
        print("Header UI rewrite completed via regex!")
    else:
        print("Could not find header regex.")
