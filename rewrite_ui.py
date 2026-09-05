import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Update overall app background and header
app_bg_target = """    <div className="flex min-h-screen bg-[#0A0A0A] text-gray-100 font-sans relative overflow-hidden selection:bg-primary-500/30">
      {/* Efek grid & glow background ambient */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--color-primary-500) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary-500) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 w-full max-w-full">
        {/* 
        =======================================================================
        HEADER APLIKASI
        =======================================================================
        */}
        <header className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-primary-900/40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative">
                <button 
                  onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#140F2A] border border-primary-500/30 hover:border-primary-500/70 text-primary-300 transition-all shadow-lg hover:shadow-primary-500/20 group cursor-pointer"
                >
                  <div className="flex flex-col gap-1.5 items-center justify-center w-5 h-5">
                    <span className={`block h-[2px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                    <span className={`block h-[2px] w-full bg-current transition duration-300 ease-in-out ${isTopMenuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block h-[2px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
                  </div>
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

app_bg_replacement = """    <div className="flex min-h-screen bg-[#09090b] text-gray-100 font-sans relative overflow-hidden selection:bg-primary-500/30">

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 w-full max-w-full">
        {/* 
        =======================================================================
        HEADER APLIKASI
        =======================================================================
        */}
        <header className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-transparent">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="relative">
              <button 
                onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl sm:rounded-3xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <div className="flex flex-col gap-1.5 items-center justify-center w-5 h-5">
                  <span className={`block h-[2px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                  <span className={`block h-[2px] w-full bg-current transition duration-300 ease-in-out ${isTopMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-[2px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
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
              <div className="px-6 py-2.5 rounded-full border border-primary-500/30 bg-transparent flex items-center justify-center">
                <h1 className="text-sm sm:text-base font-bold tracking-widest text-primary-400 font-mono uppercase">
                  Bara AI
                </h1>
              </div>
            </div>

            <button 
              onClick={() => setIsSettingsMenuOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl sm:rounded-3xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>
        </header>"""

content = content.replace(app_bg_target, app_bg_replacement)

# 2. Main content area (remove borders and backgrounds)
main_target = """        {/* 
        =======================================================================
        KONTEN UTAMA APLIKASI (TAB BASED)
        =======================================================================
        */}
        <main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-4 max-w-3xl">
          
          <section className="flex flex-col flex-1 bg-[#0E0E12]/90 border border-primary-900/50 rounded-3xl overflow-hidden backdrop-blur-xl relative animate-fade-in mb-4 sm:mb-6">"""

main_replacement = """        {/* 
        =======================================================================
        KONTEN UTAMA APLIKASI (TAB BASED)
        =======================================================================
        */}
        <main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-4 max-w-3xl">
          
          <section className="flex flex-col flex-1 relative animate-fade-in mb-4 sm:mb-6">"""

content = content.replace(main_target, main_replacement)

# 3. Chat Area mapping updates
chat_area_pattern = re.compile(r'\{messages\.map\(\(msg\) => \{.*?isAi \? \'justify-start\' : \'justify-end\'\s*\}\`\s*>\s*\{/\* Avatar AI Agent.*?\{\/\*\s*Bubble Chat\s*\*\/\}\s*<div className=\{\`flex flex-col gap-1 max-w-\[85%\] sm:max-w-\[75%\] \$\{\s*isAi \? \'items-start\' : \'items-end\'\s*\}\`\}>\s*<div className="flex items-center gap-2 px-1">\s*<span className="text-\[10px\] sm:text-xs font-mono font-medium text-gray-500">\s*\{isAi \? \'Bara AI\' : \(googleUser\?\.displayName \|\| \'USER \(Cak\)\'\)\}\s*</span>\s*<span className="text-\[9px\] sm:text-\[10px\] font-mono text-gray-600">\{msg\.timestamp\}</span>\s*</div>\s*<div className=\{\`relative px-4 sm:px-5 py-3 sm:py-3\.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed \$\{\s*isAi \s*\? \'bg-\[#1A1A24\]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm\' \s*: \'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm\'\s*\}\`\}>\s*<div className="whitespace-pre-wrap">\s*\{renderMessageText\(msg\.text\)\}\s*</div>\s*\{isAi && \(\s*<div className="mt-3 pt-3 flex items-center gap-2">\s*<button \s*onClick=\{\(\) => handleCopy\(msg\.text\)\}\s*className="p-1\.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"\s*title="Salin Pesan"\s*>\s*<Copy className="w-4 h-4" />\s*</button>\s*<button \s*onClick=\{\(\) => handleFeedback\(msg\.id, \'up\'\)\}\s*className=\{\`p-1\.5 rounded-md hover:bg-white/10 transition-colors \$\{msg\.feedback === \'up\' \? \'text-green-500\' : \'text-gray-400 hover:text-gray-200\'\}\`\}\s*title="Bagus"\s*>\s*<ThumbsUp className="w-4 h-4" />\s*</button>\s*<button \s*onClick=\{\(\) => handleFeedback\(msg\.id, \'down\'\)\}\s*className=\{\`p-1\.5 rounded-md hover:bg-white/10 transition-colors \$\{msg\.feedback === \'down\' \? \'text-red-500\' : \'text-gray-400 hover:text-gray-200\'\}\`\}\s*title="Buruk"\s*>\s*<ThumbsDown className="w-4 h-4" />\s*</button>\s*</div>\s*\)\}\s*</div>\s*</div>\s*\{/\* Avatar User.*?</div>\s*\);\s*\}\)\}', re.DOTALL)

chat_replacement = """{messages.map((msg) => {
     const isAi = msg.sender === 'ai';
     return (
       <div 
         key={msg.id}
         className={`flex flex-col gap-1 w-full ${isAi ? 'items-start' : 'items-end'}`}
       >
         <div className={`flex flex-col w-fit max-w-[85%] sm:max-w-[75%] ${isAi ? 'items-start' : 'items-end'}`}>
           <div className={`relative px-4 sm:px-5 py-3.5 rounded-3xl ${
             isAi 
               ? 'bg-transparent text-gray-200' 
               : 'bg-[#151025] border border-primary-500/30 text-white rounded-tr-md'
           }`}>
             {!isAi && (
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-primary-500 font-mono text-[10px] sm:text-xs tracking-wider">
                   > {googleUser?.displayName?.split(' ')[0] || 'Bara'}
                 </span>
               </div>
             )}
             {isAi && (
               <div className="flex items-center gap-2 mb-2">
                 <span className="text-primary-500 font-mono text-[10px] sm:text-xs tracking-wider uppercase">
                   BARA AI
                 </span>
               </div>
             )}
             
             <div className="whitespace-pre-wrap text-sm sm:text-base">
               {renderMessageText(msg.text)}
             </div>
             
             {isAi && (
               <div className="mt-3 flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => handleCopy(msg.text)}
                   className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
                   title="Salin Pesan"
                 >
                   <Copy className="w-3.5 h-3.5" />
                 </button>
                 <button 
                   onClick={() => handleFeedback(msg.id, 'up')}
                   className={`p-1 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-gray-200'}`}
                   title="Bagus"
                 >
                   <ThumbsUp className="w-3.5 h-3.5" />
                 </button>
                 <button 
                   onClick={() => handleFeedback(msg.id, 'down')}
                   className={`p-1 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                   title="Buruk"
                 >
                   <ThumbsDown className="w-3.5 h-3.5" />
                 </button>
               </div>
             )}
           </div>
         </div>
       </div>
     );
   })}"""

content = chat_area_pattern.sub(chat_replacement, content)

# 4. Input Area updates
input_target = """          {/* 
          ===================================================================
          3. INPUT AREA
          Textarea + Tombol "Kirim Perintah", Placeholder: "Perintahkan aku cak..."
          ===================================================================
          */}
          <div className="p-3 sm:p-4 bg-[#110D1E]/90 border-t border-primary-900/50 backdrop-blur-lg">

            {/* Kotak Input Textarea & Tombol Kirim */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCommand();
              }}
              className="flex items-center gap-2 sm:gap-3 relative"
            >
              {/* Attachment Button & Menu */}
              <div className="relative shrink-0">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                  className="h-[52px] sm:h-[58px] w-[52px] sm:w-[58px] flex items-center justify-center rounded-xl bg-[#141416]/90 border border-primary-500/40 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-all cursor-pointer "
                >
                  <Plus className={`w-6 h-6 transition-transform duration-300 ${isAttachmentMenuOpen ? 'rotate-45' : ''}`} />
                </button>

                {isAttachmentMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#141416]/95 backdrop-blur-xl border border-primary-500/40 rounded-2xl overflow-hidden animate-fade-in p-2 flex flex-col gap-1 z-50">
                    <button 
                      type="button"
                      onClick={handleFileUploadClick}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-primary-400" />
                      <span>Upload File</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setIsAttachmentMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-primary-400" />
                      <span>Kamera</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Textarea */}
              <div className="relative flex-1 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-600/30 to-indigo-600/30 rounded-2xl blur opacity-30 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative flex flex-col bg-[#141416]/90 border border-primary-500/40 rounded-2xl overflow-hidden transition-all duration-300 focus-within:border-primary-500/80">
                  {attachedFile && (
                    <div className="px-4 pt-3 flex items-center justify-between animate-fade-in">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-900/20 border border-primary-500/30 rounded-lg text-xs text-primary-300 w-fit max-w-[200px]">
                        <ImageIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{attachedFile.name}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={removeAttachedFile}
                        className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <textarea
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Perintahkan aku cak..."
                    className="w-full bg-transparent text-gray-100 px-4 sm:px-5 py-3 sm:py-4 focus:outline-none resize-none overflow-hidden min-h-[52px] sm:min-h-[58px] text-sm sm:text-base placeholder-gray-500 font-medium"
                    rows={1}
                    disabled={isThinking}
                  />
                </div>
              </div>

              {/* Tombol Kirim */}
              <button
                type="submit"
                disabled={isThinking || (!inputCommand.trim() && !attachedFile)}
                className={`shrink-0 h-[52px] sm:h-[58px] w-[52px] sm:w-[58px] flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                  inputCommand.trim() || attachedFile
                    ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-0.5' 
                    : 'bg-[#18181B]/80 text-gray-500 border border-primary-900/30'
                }`}
              >
                {isThinking ? (
                  <div className="w-5 h-5 border-2 border-primary-200 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className={`w-5 sm:w-6 h-5 sm:h-6 ${inputCommand.trim() || attachedFile ? 'ml-1' : ''}`} />
                )}
              </button>
            </form>
          </div>
        </main>
      </div>"""

input_replacement = """          {/* 
          ===================================================================
          3. INPUT AREA
          ===================================================================
          */}
          <div className="px-4 sm:px-6 pb-6 pt-2 bg-transparent">
            {/* Kotak Input Textarea & Tombol Kirim */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendCommand();
              }}
              className="flex flex-col gap-3 relative max-w-4xl mx-auto"
            >
              <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-full shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">
                {/* Attachment Button */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary-900/20 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer ml-1"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Textarea */}
                <div className="flex-1 px-3 py-1 flex items-center">
                  {attachedFile && (
                    <div className="flex items-center gap-2 px-3 py-1 mr-2 bg-primary-900/40 border border-primary-500/40 rounded-full text-xs text-primary-200 shrink-0">
                      <ImageIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[80px]">{attachedFile.name}</span>
                      <button type="button" onClick={removeAttachedFile} className="hover:text-red-400">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <textarea
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Bara AI..."
                    className="w-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-hidden min-h-[24px] h-[24px] pt-[2px] text-sm sm:text-base placeholder-gray-500 font-mono tracking-wide"
                    rows={1}
                    disabled={isThinking}
                  />
                </div>

                {/* Tombol Kirim */}
                <button
                  type="submit"
                  disabled={isThinking || (!inputCommand.trim() && !attachedFile)}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all cursor-pointer mr-1 ${
                    inputCommand.trim() || attachedFile
                      ? 'bg-primary-700 hover:bg-primary-600 text-white' 
                      : 'bg-primary-900/30 text-primary-500/50'
                  }`}
                >
                  {isThinking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className={`w-4 h-4 ${(inputCommand.trim() || attachedFile) ? 'ml-0.5' : ''}`} />
                  )}
                </button>
              </div>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-500 font-mono">Bara AI dapat membuat kesalahan. Periksa info penting.</p>
              </div>
            </form>
          </div>
        </main>
      </div>"""

content = content.replace(input_target, input_replacement)

# 5. Hide Thinking simulation box (make it simple text or remove bubble)
thinking_target = """      {/* 
      -----------------------------------------------------------------
      SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")
      Tampil ketika isThinking == true
      -----------------------------------------------------------------
      */}
      {isThinking && (
        <div className="flex items-start gap-3 sm:gap-4 justify-start animate-fade-in">
          {/* Avatar AI animasi pulse */}
          <div className="flex-shrink-0 mt-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-900/60 border border-primary-400/80 flex items-center justify-center animate-pulse">
              <Sparkles className="w-5 h-5 text-primary-300 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>
          
          {/* Bubble "Agent sedang berpikir..." */}
          <div className="bg-[#141416]/90 border border-primary-500/50 rounded-2xl px-5 py-4 flex items-center gap-3">
            {/* Animasi ketik 3 dot */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            
          </div>
        </div>
      )}"""

thinking_replacement = """      {isThinking && (
        <div className="flex flex-col gap-1 w-full items-start animate-fade-in">
           <div className="flex items-center gap-2 mb-2 px-4">
             <span className="text-primary-500 font-mono text-[10px] sm:text-xs tracking-wider uppercase">
               BARA AI
             </span>
           </div>
           <div className="px-4 py-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }} />
           </div>
        </div>
      )}"""

content = content.replace(thinking_target, thinking_replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("UI rewrite completed!")
