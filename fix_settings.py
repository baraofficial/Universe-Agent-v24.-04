import re

with open("src/App.tsx", "r") as f:
    content = f.read()

settings_bottom_target = """                {isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan</p>}
              </div>
            </div>
          </div>
        </div>
      )}"""

settings_bottom_repl = """                {isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan</p>}
              </div>
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-primary-900/30">
                <button 
                  onClick={() => setShowClearHistoryConfirm(true)}
                  className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Riwayat Pesan
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500 hover:bg-red-600/30 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Clear History Modal */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowClearHistoryConfirm(false)}>
          <div className="bg-[#141416] border border-red-500/50 rounded-2xl w-full max-w-xs p-6 shadow-2xl scale-100 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center mb-2">Hapus Riwayat?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Yakin ingin hapus riwayat pesan?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearHistoryConfirm(false)} className="flex-1 py-2 rounded-xl bg-[#2A2A35] text-white hover:bg-[#3A3A45] font-medium transition-colors cursor-pointer text-sm">
                Batal
              </button>
              <button onClick={() => { handleClearChat(); setShowClearHistoryConfirm(false); setIsSettingsMenuOpen(false); }} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer text-sm">
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-[#141416] border border-red-500/50 rounded-2xl w-full max-w-xs p-6 shadow-2xl scale-100 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center mb-2">Log Out?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Yakin ingin log out dari akun ini?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2 rounded-xl bg-[#2A2A35] text-white hover:bg-[#3A3A45] font-medium transition-colors cursor-pointer text-sm">
                Batal
              </button>
              <button onClick={() => { 
                setUserName(''); 
                localStorage.removeItem(STORAGE_KEY_USERNAME); 
                setShowLogoutConfirm(false); 
                setIsSettingsMenuOpen(false); 
              }} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer text-sm">
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
"""

content = content.replace(settings_bottom_target, settings_bottom_repl)

with open("src/App.tsx", "w") as f:
    f.write(content)

