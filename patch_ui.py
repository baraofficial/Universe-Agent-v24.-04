import re

with open('src/App.tsx', 'r') as f:
    app_tsx = f.read()

# 1. Add theme and modal states
state_code = """
  // --- STATE THEME & MODALS ---
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('bara_theme') || 'purple';
  });
  useEffect(() => {
    localStorage.setItem('bara_theme', theme);
  }, [theme]);

  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
"""
app_tsx = app_tsx.replace("  // --- STATE GOOGLE LOGIN ---", state_code + "\n  // --- STATE GOOGLE LOGIN ---")

# 2. Add theme class to main container
app_tsx = app_tsx.replace('className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white"',
                          'className={`min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-${theme}`}')

# 3. Update Header (Top Left: Hamburger -> Tools, Top Right: Gear -> Settings)
# We will find the header and replace its inner content.
header_start = app_tsx.find('<header className="border-b border-primary-900/50 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">')
header_end = app_tsx.find('</header>', header_start) + len('</header>')

new_header = """      <header className="border-b border-primary-900/50 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsToolsMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl bg-primary-900/20 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl blur-md opacity-75 animate-pulse" />
                <div className="relative bg-[#140F2A] border border-primary-500/50 p-2.5 rounded-xl ">
                  <Wrench className="w-6 h-6 text-primary-400" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-primary-400 font-orbitron glow-primary-text">
                  Bara Agent
                </h1>
                <p className="text-[10px] text-primary-300/70 font-mono hidden sm:block">
                  [AUTONOMOUS AI SYSTEM]
                </p>
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
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-primary-900/20 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </div>
      </header>"""
app_tsx = app_tsx[:header_start] + new_header + app_tsx[header_end:]

# 4. We will add the Modals just before the closing </div> of the app.
modals_code = """
      {/* =======================================================================
          MODALS / DRAWERS
          ======================================================================= */}
      {/* Settings Modal (Gear Icon) */}
      {isSettingsMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 border-b border-primary-900/30">
              <h2 className="text-lg font-orbitron font-bold text-primary-400">Settings</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400">
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
                    <button onClick={handleGoogleLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Logout">
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
                    <button onClick={() => { setUserName(tempUserName); setIsEditingUserName(false); }} className="p-2 bg-primary-600 rounded-xl text-white"><CheckCircle2 className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={() => { setTempUserName(userName); setIsEditingUserName(true); }} className="p-2 bg-primary-900/30 text-primary-400 rounded-xl"><Wrench className="w-4 h-4" /></button>
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
                      className={`flex-1 py-2 flex flex-col items-center gap-2 border rounded-xl transition-all ${theme === t.id ? 'border-primary-400 bg-primary-900/20' : 'border-gray-800 bg-transparent hover:border-gray-600'}`}
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
                   }} className="text-xs bg-primary-600 px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1">
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
        <div className="fixed inset-0 z-50 flex items-start justify-start bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 border-b border-primary-900/30">
              <h2 className="text-lg font-orbitron font-bold text-primary-400">Tools Bara Agent</h2>
              <button onClick={() => setIsToolsMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400">
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
                    className={`p-3 rounded-xl border flex flex-col gap-2 items-start transition-all ${
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
app_tsx = app_tsx.replace('    </div>\n  );\n}\n', modals_code + '\n    </div>\n  );\n}\n')

# 5. Modify Bottom Navigation: Remove prompt and tools.
# We'll just replace the array in the bottom nav.
bottom_nav_target = """              [
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'prompt', label: 'Prompt', icon: Terminal },
                { id: 'tools', label: 'Tools', icon: Wrench },
                { id: 'history', label: 'Riwayat', icon: History },
                { id: 'account', label: 'Akun', icon: UserCircle },
              ]"""
bottom_nav_replace = """              [
                { id: 'chat', label: 'Chat', icon: MessageSquare },
                { id: 'history', label: 'Riwayat', icon: History },
              ]"""
app_tsx = app_tsx.replace(bottom_nav_target, bottom_nav_replace)

# We should also remove the main tab contents for prompt, tools, account.
app_tsx = re.sub(r'\{activeTab === \'prompt\' && \(.*?</section>\n\s*\)\}', '', app_tsx, flags=re.DOTALL)
app_tsx = re.sub(r'\{activeTab === \'tools\' && \(.*?</section>\n\s*\)\}', '', app_tsx, flags=re.DOTALL)
app_tsx = re.sub(r'\{activeTab === \'account\' && \(.*?</section>\n\s*\)\}', '', app_tsx, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(app_tsx)

print("UI Patched successfully")
