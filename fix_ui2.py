import re

with open("src/App.tsx", "r") as f:
    content = f.read()

modals = """
      {/* Settings Modal (Gear Icon) */}
      {isSettingsMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-primary-900/30 shrink-0">
              <h2 className="text-lg font-orbitron font-bold text-primary-400">Settings</h2>
              <button onClick={() => setIsSettingsMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex flex-col gap-6">
              {/* Google Login */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Akun Google</h3>
                {googleUser ? (
                  <div className="flex items-center justify-between p-3 bg-primary-900/10 border border-primary-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={googleUser.picture} alt="Profile" className="w-10 h-10 rounded-full border border-primary-500" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-semibold text-sm">{googleUser.name}</p>
                        <p className="text-xs text-gray-400">{googleUser.email}</p>
                      </div>
                    </div>
                    <button onClick={handleGoogleLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer" title="Logout">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </button>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    shape="pill"
                    size="medium"
                    theme="filled_black"
                  />
                )}
              </div>

              {/* Edit Username */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Username Panggilan</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={isEditingUserName ? tempUserName : userName}
                    onChange={(e) => setTempUserName(e.target.value)}
                    disabled={!isEditingUserName}
                    className="flex-1 bg-primary-900/10 border border-primary-500/30 rounded-xl px-3 py-2 text-sm text-gray-200 disabled:opacity-50"
                  />
                  {isEditingUserName ? (
                    <button onClick={() => { setUserName(tempUserName); setIsEditingUserName(false); }} className="p-2 bg-primary-600 rounded-xl text-white cursor-pointer"><CheckCircle2 className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={() => { setTempUserName(userName); setIsEditingUserName(true); }} className="p-2 bg-primary-900/30 text-primary-400 rounded-xl cursor-pointer"><Wrench className="w-4 h-4" /></button>
                  )}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Tema Aplikasi</h3>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'purple', name: 'Purple', bg: 'bg-purple-500' },
                    { id: 'green', name: 'Green', bg: 'bg-emerald-500' },
                    { id: 'blue', name: 'Blue', bg: 'bg-blue-500' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex-1 py-2 flex flex-col items-center gap-2 border rounded-xl transition-all cursor-pointer ${theme === t.id ? 'border-primary-400 bg-primary-900/20' : 'border-gray-800 bg-transparent hover:border-gray-600'}`}
                    >
                      <div className={`w-4 h-4 rounded-full ${t.bg}`}></div>
                      <span className="text-xs">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">System Prompt</h3>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-primary-900/10 border border-primary-500/30 rounded-xl px-3 py-2 text-xs text-gray-300 min-h-[120px]"
                />
                <div className="flex justify-end">
                   <button onClick={() => {
                     localStorage.setItem('bara_system_prompt', systemPrompt);
                     setIsPromptSavedToast(true);
                     setTimeout(() => setIsPromptSavedToast(false), 3000);
                   }} className="text-xs bg-primary-600 px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1 cursor-pointer">
                     <Save className="w-3 h-3" /> Simpan Prompt
                   </button>
                </div>
                {isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools Modal (Hamburger Menu) */}
      {isToolsMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-start bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 border-b border-primary-900/30 shrink-0">
              <h2 className="text-lg font-orbitron font-bold text-primary-400">Tools Bara Agent</h2>
              <button onClick={() => setIsToolsMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-3">
              <p className="text-sm text-gray-400 mb-2">Pilih tool untuk digunakan agent dalam merespons instruksi selanjutnya.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Umum', icon: Globe, desc: 'Percakapan AI Umum' },
                  { id: 'Browser', icon: Globe, desc: 'Pencarian Internet' },
                  { id: 'Kalkulator', icon: Calculator, desc: 'Hitung Matematika' },
                  { id: 'Sistem', icon: Terminal, desc: 'Operasi Sistem' },
                  { id: 'Deploy Tools', icon: Activity, desc: 'Github & Deploy' },
                  { id: 'Error', icon: Wrench, desc: 'Troubleshooting' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveToolBadge(t.id);
                      setIsToolsMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col gap-2 items-start transition-all cursor-pointer ${
                      activeToolBadge === t.id 
                        ? 'bg-primary-900/40 border-primary-500' 
                        : 'bg-primary-900/10 border-primary-900/30 hover:border-primary-500/50 hover:bg-primary-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <t.icon className={`w-4 h-4 ${activeToolBadge === t.id ? 'text-primary-300' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${activeToolBadge === t.id ? 'text-primary-300' : 'text-gray-300'}`}>{t.id}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
"""
content = content.replace('<nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95', modals + '\n<nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95')

with open("src/App.tsx", "w") as f:
    f.write(content)
