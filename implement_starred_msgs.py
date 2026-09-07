import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Add state
state_target = "const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);"
state_repl = "const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);\n  const [isStarredMessagesOpen, setIsStarredMessagesOpen] = useState(false);"
content = content.replace(state_target, state_repl)

# Add button in room settings modal
btn_target = """                {roomWallpaper && (
                  <button 
                    onClick={() => { setRoomWallpaper(null); setRoomWallpaperType(null); }}
                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors mt-2 cursor-pointer"
                  >
                    Hapus Wallpaper
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}"""
      
btn_repl = """                {roomWallpaper && (
                  <button 
                    onClick={() => { setRoomWallpaper(null); setRoomWallpaperType(null); }}
                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors mt-2 cursor-pointer"
                  >
                    Hapus Wallpaper
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-primary-900/30">
                <button 
                  onClick={() => {
                    setIsRoomSettingsOpen(false);
                    setIsStarredMessagesOpen(true);
                  }}
                  className="w-full py-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Star className="w-5 h-5 fill-current" />
                  Pesan Berbintang
                </button>
              </div>

            </div>
          </div>
        </div>
      )}"""

content = content.replace(btn_target, btn_repl)


# Add sidebar
sidebar_target = "{/* Settings Modal (Gear Icon) */}"
sidebar_repl = """{/* Starred Messages Sidebar */}
      {isStarredMessagesOpen && chatMode === 'room' && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsStarredMessagesOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-80 bg-[#09090b] border-l border-primary-500/30 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-4 border-b border-primary-900/30 flex items-center justify-between">
              <h2 className="text-lg font-orbitron font-bold text-yellow-400 flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                Pesan Berbintang
              </h2>
              <button onClick={() => setIsStarredMessagesOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
              {roomMessages.filter(msg => msg.star).length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  Belum ada pesan berbintang
                </div>
              ) : (
                roomMessages.filter(msg => msg.star).map(msg => (
                  <div key={`star-${msg.id}`} className="bg-[#1A1A24] border border-primary-900/30 p-3 rounded-xl flex flex-col gap-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary-400 font-bold">{msg.senderName}</span>
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4">{msg.text}</p>
                    <button 
                      onClick={() => {
                        setRoomMessages(prev => prev.map(m => m.id === msg.id ? { ...m, star: false } : m));
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-gray-400 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Settings Modal (Gear Icon) */}"""

content = content.replace(sidebar_target, sidebar_repl)

with open("src/App.tsx", "w") as f:
    f.write(content)

