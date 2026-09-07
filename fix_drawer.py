import re

with open("src/App.tsx", "r") as f:
    content = f.read()

sidebar_target = """                  <div className="p-4 flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        setChatMode('room');
                        setIsTopMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-[#1A1A24] hover:bg-primary-900/30 border border-primary-500/30 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium"
                    >
                      <Users className="w-5 h-5 text-primary-400" />
                      Room Chat
                    </button>
                    
                    <button 
                      onClick={() => {
                        setChatMode('ai');
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
                  </div>"""

sidebar_replacement = """                  <div className="p-4 flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        setChatMode('room');
                        setIsTopMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-primary-900/30 border border-primary-500/30 flex items-center gap-3 transition-colors cursor-pointer font-medium ${chatMode === 'room' ? 'bg-primary-900/40 text-primary-300' : 'bg-[#1A1A24] text-white'}`}
                    >
                      <Users className="w-5 h-5 text-primary-400" />
                      Room Chat
                    </button>

                    <button 
                      onClick={() => {
                        setChatMode('ai');
                        setIsTopMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-primary-900/30 border border-primary-500/30 flex items-center gap-3 transition-colors cursor-pointer font-medium ${chatMode === 'ai' ? 'bg-primary-900/40 text-primary-300' : 'bg-[#1A1A24] text-white'}`}
                    >
                      <Bot className="w-5 h-5 text-primary-400" />
                      Bara AI
                    </button>
                    
                    {chatMode === 'ai' && (
                      <button 
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
                  </div>"""

content = content.replace(sidebar_target, sidebar_replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

