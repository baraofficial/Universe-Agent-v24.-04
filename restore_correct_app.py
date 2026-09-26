with open('src/App.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

marker = '// RENDER UI UTAMA APLIKASI'
idx = text.find(marker)
if idx != -1:
    base_code = text[:idx]
else:
    base_code = text[:text.find('export default function App()')]

app_rest = '''// ============================================================================
 // RENDER UI UTAMA APLIKASI
 // ============================================================================
 return (
    <>
      {isAuthLoading ? (
        <div className="flex h-screen items-center justify-center bg-[#050505] text-primary-500">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !user ? (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4 font-mono">
          <div className="max-w-md w-full bg-[#141416] border border-primary-500/30 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
            <div className="w-20 h-20 bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/40 p-2">
              <img src="/bara-ai-logo.jpg" alt="Bara AI Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-200 mb-2 font-orbitron tracking-wider">BARA AI</h1>
            <p className="text-gray-400 text-center text-sm mb-6">Masuk untuk melanjutkan ke sistem AI Assistant dan Room Chat.</p>

            {loginErrorMessage && (
              <div className="w-full mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs text-left leading-relaxed animate-fade-in">
                <p className="font-bold mb-1">⚠️ Catatan Login Domain:</p>
                <p>{loginErrorMessage}</p>
              </div>
            )}

            {/* Google Login Button */}
            <button 
              onClick={handleLogin} 
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Login dengan Google
            </button>
          </div>
        </div>
      ) : (
        <div className={`fixed inset-0 overflow-hidden bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-${theme}`}>
          {chatMode === 'room' && roomWallpaper && (
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
              {roomWallpaperType === 'video' ? (
                <video autoPlay loop muted playsInline src={roomWallpaper} className="w-full h-full object-cover" />
              ) : (
                <img src={roomWallpaper} alt="Room Wallpaper" className="w-full h-full object-cover" />
              )}
            </div>
          )}

          {/* HEADER */}
          <header className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-transparent">
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
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="p-4 flex flex-col gap-3">
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
                          <img src="/bara-ai-logo.jpg" alt="Bara AI" className="w-5 h-5 rounded-md object-cover" />
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

                        {chatMode === 'ai' && (
                          <div className="mt-4 flex flex-col gap-2 flex-1 overflow-y-auto max-h-[50vh] pr-1 pb-4">
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 px-1">Riwayat Chat Tersimpan</div>
                            {chatSessions.length === 0 ? (
                              <div className="text-xs text-gray-500 italic px-2 py-3 bg-[#141416]/50 rounded-xl text-center border border-white/5">
                                Belum ada percakapan tersimpan
                              </div>
                            ) : (
                              chatSessions.map(session => (
                                <div 
                                  key={session.id} 
                                  onClick={() => handleSelectSession(session.id)} 
                                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer border ${
                                    currentSessionId === session.id 
                                      ? 'bg-primary-900/40 border-primary-500/50 text-primary-300 shadow-md' 
                                      : 'bg-[#141416]/80 hover:bg-white/5 border-white/5 hover:border-white/10 text-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 pr-1">
                                    <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === session.id ? 'text-primary-400' : 'text-gray-500'}`} />
                                    <span className="text-xs sm:text-sm truncate font-medium">
                                      {session.title || 'Percakapan Baru'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-1 shrink-0">
                                    {session.isStarred && (
                                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                    )}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSession(session.id);
                                      }}
                                      className="p-1 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                                      title="Hapus Pesan Ini"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActionMenuSessionId(actionMenuSessionId === session.id ? null : session.id);
                                      }}
                                      className="p-1 rounded-md hover:bg-white/10 text-gray-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                      <MoreVertical className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {actionMenuSessionId === session.id && (
                                    <div className="absolute right-0 top-10 w-40 bg-[#141416] border border-primary-500/30 rounded-xl shadow-2xl py-1 z-[60] animate-fade-in" onClick={(e) => e.stopPropagation()}>
                                      <button onClick={() => { handleToggleStarSession(session.id); setActionMenuSessionId(null); }} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                                        <Star className={`w-3.5 h-3.5 ${session.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                        {session.isStarred ? 'Hapus Bintang' : 'Bintangi'}
                                      </button>
                                      <button onClick={() => { handleShareSession(session.id); setActionMenuSessionId(null); }} className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-white/5 flex items-center gap-2 cursor-pointer transition-colors">
                                        <Share2 className="w-3.5 h-3.5" />
                                        Bagikan
                                      </button>
                                      <button onClick={() => { handleDeleteSession(session.id); setActionMenuSessionId(null); }} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Hapus
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-auto p-4 text-center border-t border-primary-900/30">
                        <p className="text-xs text-gray-500 font-mono tracking-wider">
                          © Bara Official X Bara AI
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 flex justify-center">
                <div className="px-6 py-2 rounded-full border border-primary-500/40 bg-[#120F1D]/50 flex items-center justify-center">
                  <h1 className="text-sm font-bold tracking-widest text-primary-400 font-mono uppercase">
                    {chatMode === 'ai' ? 'Bara AI' : 'Room Chat'}
                  </h1>
                </div>
              </div>

              <div className="w-12 h-12 flex items-center justify-end">
                {chatMode === 'room' ? (
                  <button 
                    onClick={() => setIsRoomSettingsOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-5 h-5" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsSettingsMenuOpen(true)}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
                  >
                    <Wrench className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* MAIN CHAT */}
          <main className="flex-1 w-full mx-auto flex flex-col overflow-hidden p-0 max-w-full pb-0">
            <section className="flex flex-col flex-1 overflow-hidden relative animate-fade-in bg-transparent border-none rounded-none mb-0">
              <div 
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
              >
                {chatMode === 'ai' && messages.map((msg) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div 
                      key={msg.id}
                      className={`flex items-start gap-3 sm:gap-4 ${
                        isAi ? 'justify-start' : 'justify-end'
                      }`}
                    >
                      {isAi && (
                        <div className="flex-shrink-0 relative mt-1">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-primary-400/60 flex items-center justify-center overflow-hidden"><img src="/bara-ai-logo.jpg" alt="Bara AI" className="w-full h-full object-cover" /></div>
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]" />
                        </div>
                      )}
                      
                      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${
                        isAi ? 'items-start' : 'items-end'
                      }`}>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
                            {isAi ? 'Bara AI' : (userName || 'USER')}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
                        </div>
                        <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
                          isAi 
                            ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
                            : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
                        }`}>
                          {msg.file && msg.file.type?.startsWith('image/') && (
                            <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                              <img src={msg.file.dataUrl} alt="Upload" className="w-full h-auto object-cover max-h-32" />
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">
                            {renderMessageText(msg.text)}
                          </div>
                          
                          {isAi && (
                            <div className="mt-3 pt-3 flex items-center gap-2">
                              <button 
                                onClick={() => handleCopyAiMessage(msg.id, msg.text)}
                                className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
                                title="Salin Pesan"
                              >
                                {copiedAiMessageId === msg.id ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleFeedback(msg.id, 'up')}
                                className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-gray-200'}`}
                                title="Bagus"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleFeedback(msg.id, 'down')}
                                className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                                title="Buruk"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isAi && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
                            {userAvatar ? (
                              <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-6 h-6 text-primary-500/50" />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {chatMode === 'room' && roomMessages.map((msg) => {
                  const isMe = msg.isMe;
                  return (
                    <motion.div 
                      key={msg.id}
                      className={`flex items-start gap-3 sm:gap-4 ${isMe ? 'justify-end' : 'justify-start'}`}
                      drag={!isMe ? "x" : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={{ left: 0.5, right: 0 }}
                      onDragEnd={(e, info) => {
                        if (!isMe && info.offset.x < -40) {
                          setReplyingTo(msg);
                        }
                      }}
                    >
                      {!isMe && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
                            {userAvatar ? (
                              <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-6 h-6 text-primary-500/50" />
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
                        </div>
                        <div 
                          onClick={() => setSelectedRoomMessage(msg)}
                          onContextMenu={(e) => { e.preventDefault(); setSelectedRoomMessage(msg); }}
                          className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed cursor-pointer transition-colors hover:brightness-110 ${
                          !isMe
                            ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
                            : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
                        } ${msg.pin ? 'border-amber-500/50 ring-1 ring-amber-500/30' : ''}`}>
                          {msg.replyTo && (
                            <div className="mb-2 p-2 rounded-lg bg-black/20 border-l-2 border-primary-500 text-xs">
                              <div className="text-primary-300 font-bold mb-0.5">{msg.replyTo.senderName}</div>
                              <div className="text-gray-300 line-clamp-2">{msg.replyTo.text}</div>
                            </div>
                          )}
                          {msg.file && msg.file.type?.startsWith('image/') && (
                            <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                              <img src={msg.file.dataUrl} alt="Upload" className="w-full h-auto object-cover max-h-32" />
                            </div>
                          )}
                          {msg.text && (
                            <div className="whitespace-pre-wrap">
                              {msg.text}
                            </div>
                          )}
                          {msg.isEdited && <div className="text-[10px] text-gray-500 mt-1 italic">(diedit)</div>}
                          {msg.file && msg.file.type?.startsWith('video/') && (
                            <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                              <video src={msg.file.dataUrl} controls className="w-full h-auto object-cover max-h-48" />
                            </div>
                          )}
                          {msg.file && !msg.file.type?.startsWith('image/') && !msg.file.type?.startsWith('video/') && (
                            <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                              <Folder className="w-3 h-3" /> {msg.file.name}
                            </div>
                          )}
                        </div>
                        {/* Indicators & Actions */}
                        <div className={`flex items-center gap-1.5 px-1 mt-0.5 text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setSelectedRoomMessage(msg); }}
                            className="p-1 hover:text-primary-400 transition-colors cursor-pointer text-[10px] flex items-center gap-1 text-gray-400 hover:bg-white/5 rounded-md px-1.5 py-0.5"
                            title="Opsi Pesan (Hapus, Bintang, Sematkan)"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          {msg.star && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />}
                          {msg.pin && <Pin className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                          {isMe && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRoomMessageId(msg.id);
                                setInputCommand(msg.text);
                              }}
                              className="p-0.5 hover:text-primary-400 transition-colors cursor-pointer"
                              title="Edit Pesan"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {isMe && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
                            {userAvatar ? (
                              <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="w-6 h-6 text-primary-500/50" />
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {isThinking && chatMode === 'ai' && (
                  <div className="flex items-start gap-3 sm:gap-4 justify-start animate-fade-in">
                    <div className="flex-shrink-0 relative mt-1">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-primary-400/80 flex items-center justify-center overflow-hidden bg-[#141416]/90 shadow-[0_0_12px_rgba(34,197,94,0.3)] animate-pulse">
                        <img src="/bara-ai-logo.jpg" alt="Bara AI Berpikir" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0A0A0A] animate-ping" />
                    </div>

                    <div className="bg-[#141416]/90 border border-primary-500/50 rounded-2xl px-5 py-4 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {showScrollButton && (
                <button 
                  onClick={() => {
                    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                    setShowScrollButton(false);
                  }}
                  className="absolute bottom-[130px] sm:bottom-[150px] left-1/2 -translate-x-1/2 p-3 rounded-full bg-primary-600 hover:bg-primary-500 text-white animate-bounce z-50 border border-primary-400 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}

              {/* INPUT FORM */}
              <div className="px-4 sm:px-6 pb-6 pt-2 bg-transparent">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (chatMode === 'ai') {
                      handleSendCommand();
                    } else {
                      handleSendRoomMessage(inputCommand);
                      setInputCommand('');
                    }
                  }}
                  className="flex flex-col gap-3 relative max-w-4xl mx-auto"
                >
                  {selectedFile && (
                    <div className="absolute -top-24 left-0 px-4 py-2 bg-[#1A1A24] border border-primary-500/50 rounded-2xl flex items-center gap-3 shadow-xl z-20 max-w-sm">
                      {selectedFile.type.startsWith('image/') ? (
                        <img src={selectedFile.dataUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl" />
                      ) : selectedFile.type.startsWith('video/') ? (
                        <video src={selectedFile.dataUrl} className="w-16 h-16 object-cover rounded-xl" />
                      ) : (
                        <div className="w-16 h-16 bg-primary-900/30 flex items-center justify-center rounded-xl">
                          <FileCode className="w-8 h-8 text-primary-400" />
                        </div>
                      )}
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-sm font-medium text-gray-200 truncate max-w-[140px] sm:max-w-[200px]">{selectedFile.name}</span>
                        <span className="text-xs text-primary-400">Siap dikirim</span>
                      </div>
                      <button type="button" onClick={() => setSelectedFile(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {editingRoomMessageId && chatMode === 'room' && (
                    <div className="absolute -top-12 left-0 right-0 px-4 py-2 bg-primary-900/90 border border-primary-500/50 rounded-2xl backdrop-blur-xl flex items-center justify-between text-sm shadow-xl z-10 mx-auto max-w-4xl w-full">
                      <div className="flex flex-col overflow-hidden max-w-[90%]">
                        <span className="text-primary-400 font-bold text-xs flex items-center gap-1"><Pencil className="w-3 h-3"/> Mengedit Pesan</span>
                      </div>
                      <button type="button" onClick={() => { setEditingRoomMessageId(null); setInputCommand(''); }} className="p-1 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {replyingTo && !editingRoomMessageId && chatMode === 'room' && (
                    <div className="absolute -top-12 left-0 right-0 px-4 py-2 bg-primary-900/90 border border-primary-500/50 rounded-2xl backdrop-blur-xl flex items-center justify-between text-sm shadow-xl z-10 mx-auto max-w-4xl w-full">
                      <div className="flex flex-col overflow-hidden max-w-[90%]">
                        <span className="text-primary-400 font-bold text-xs flex items-center gap-1"><Reply className="w-3 h-3"/> Membalas {replyingTo.senderName}</span>
                        <span className="text-gray-300 truncate text-xs">{replyingTo.text}</span>
                      </div>
                      <button type="button" onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-3xl shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">
                    <div className="relative shrink-0 flex items-center">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={chatMode === 'ai' ? 'image/*' : undefined} className="hidden" />
                      
                      {chatMode === 'ai' ? (
                        <button
                          type="button"
                          onClick={handleFileUploadClick}
                          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary-900/20 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer ml-1"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary-900/20 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer ml-1"
                          >
                            <Plus className={`w-5 h-5 transition-transform duration-300 ${isAttachmentMenuOpen ? 'rotate-45' : ''}`} />
                          </button>
                          
                          {isAttachmentMenuOpen && (
                            <div className="absolute bottom-full left-0 mb-3 w-40 bg-[#141416]/95 backdrop-blur-xl border border-primary-500/40 rounded-2xl overflow-hidden animate-fade-in p-2 flex flex-col gap-1 z-50">
                              <button 
                                type="button"
                                onClick={() => { setIsAttachmentMenuOpen(false); handleFileUploadClick(); }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                              >
                                <Camera className="w-4 h-4 text-primary-400" />
                                <span>Kamera</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => { setIsAttachmentMenuOpen(false); handleFileUploadClick(); }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                              >
                                <ImageIcon2 className="w-4 h-4 text-primary-400" />
                                <span>Galeri</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => { setIsAttachmentMenuOpen(false); handleFileUploadClick(); }}
                                className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                              >
                                <Folder className="w-4 h-4 text-primary-400" />
                                <span>File</span>
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex-1 px-3 py-1 flex items-center">
                      <textarea
                        value={inputCommand}
                        onChange={(e) => setInputCommand(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (chatMode === 'ai') {
                              handleSendCommand();
                            } else {
                              handleSendRoomMessage(inputCommand);
                              setInputCommand('');
                            }
                          }
                        }}
                        placeholder={chatMode === 'ai' ? "Message Bara AI..." : "Kirim pesan ke room..."}
                        className="w-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-hidden min-h-[24px] h-[24px] pt-[2px] text-sm sm:text-base placeholder-gray-500 font-mono tracking-wide"
                        rows={1}
                        disabled={isThinking && chatMode === 'ai'}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={(isThinking && chatMode === 'ai') || !inputCommand.trim()}
                      className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all cursor-pointer mr-1 ${
                        inputCommand.trim()
                          ? 'bg-primary-700 hover:bg-primary-600 text-white' 
                          : 'bg-primary-900/30 text-primary-500/50'
                      }`}
                    >
                      {(isThinking && chatMode === 'ai') ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className={`w-4 h-4 ${inputCommand.trim() ? 'ml-0.5 -mt-0.5' : 'ml-0.5'}`} />
                      )}
                    </button>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-mono">
                      {chatMode === 'ai' 
                        ? "Bara AI dapat membuat kesalahan. Periksa info penting." 
                        : "Room Chat: Terhubung secara real-time ke semua klien."}
                    </p>
                  </div>
                </form>
              </div>
            </section>
          </main>

          {/* Room Message Action Popup */}
          {selectedRoomMessage && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedRoomMessage(null)}>
              <div 
                className="w-full max-w-xs bg-[#141416] border border-primary-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-5 py-4 border-b border-primary-900/30">
                  <p className="text-gray-300 text-sm line-clamp-2 italic">"{selectedRoomMessage.text}"</p>
                </div>
                <div className="p-2 flex flex-wrap justify-around">
                  <button 
                    onClick={() => {
                      setReplyingTo(selectedRoomMessage);
                      setSelectedRoomMessage(null);
                    }}
                    className="flex-[0_0_25%] flex flex-col items-center gap-2 p-3 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Reply className="w-5 h-5" />
                    <span className="text-xs font-medium">Balas</span>
                  </button>
                  <button 
                    onClick={() => handleRoomMessageAction('delete')}
                    className="flex-[0_0_25%] flex flex-col items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="text-xs font-medium">Hapus</span>
                  </button>
                  <button 
                    onClick={() => handleRoomMessageAction('star')}
                    className={`flex-[0_0_25%] flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${selectedRoomMessage.star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    <Star className={`w-5 h-5 ${selectedRoomMessage.star ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium">Bintang</span>
                  </button>
                  <button 
                    onClick={() => handleRoomMessageAction('pin')}
                    className={`flex-[0_0_25%] flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${selectedRoomMessage.pin ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    <Pin className={`w-5 h-5 ${selectedRoomMessage.pin ? 'fill-current' : ''}`} />
                    <span className="text-xs font-medium">Sematkan</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Room Settings Modal */}
          {isRoomSettingsOpen && chatMode === 'room' && (
            <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsRoomSettingsOpen(false)}>
              <div 
                className="w-full max-w-sm bg-[#141416] border border-primary-900/50 rounded-3xl shadow-2xl overflow-hidden mt-12 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-4 border-b border-primary-900/30 flex items-center justify-between">
                  <h2 className="text-lg font-orbitron font-bold text-white">Setting Room Chat</h2>
                  <button onClick={() => setIsRoomSettingsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">Wallpaper Background</label>
                    <input 
                      type="file" 
                      ref={wallpaperInputRef} 
                      onChange={handleWallpaperChange} 
                      accept="image/*,video/*"
                      className="hidden" 
                    />
                    <button 
                      onClick={() => wallpaperInputRef.current?.click()}
                      className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors cursor-pointer"
                    >
                      Ganti Foto / Video (Maks 20s)
                    </button>
                    {roomWallpaper && (
                      <button 
                        onClick={() => { setRoomWallpaper(null); setRoomWallpaperType(null); deleteWallpaper().catch(console.error); }}
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
                      className="w-full py-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer mb-3"
                    >
                      <Star className="w-5 h-5 fill-current" />
                      Pesan Berbintang
                    </button>
                    <button 
                      onClick={() => {
                        setIsRoomSettingsOpen(false);
                        setIsDeleteRoomChatModalOpen(true);
                      }}
                      className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-5 h-5" />
                      Hapus
                    </button>

                    <div className="mt-4 pt-4 border-t border-primary-900/30 flex flex-col items-center gap-3">
                      <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Ikuti Kami</span>
                      <div className="flex items-center gap-4">
                        <a href="https://www.tiktok.com/@cakbagoes54" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary-900/30 flex items-center justify-center text-gray-300 hover:bg-primary-500/20 hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                        </a>
                        <a href="https://whatsapp.com/channel/0029ValiK1L2ZjCi3uWn9y1v" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary-900/30 flex items-center justify-center text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Room Chat Modal */}
          {isDeleteRoomChatModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsDeleteRoomChatModalOpen(false)}>
              <div className="bg-[#141416] border border-primary-500/30 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-primary-900/30 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-200">Hapus Pesan</h2>
                  <button onClick={() => setIsDeleteRoomChatModalOpen(false)} className="text-gray-400 hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${deleteObrolanChecked ? 'bg-primary-600 border-primary-600' : 'border-gray-500'}`}>
                      {deleteObrolanChecked && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={deleteObrolanChecked} onChange={(e) => setDeleteObrolanChecked(e.target.checked)} />
                    <span className="text-sm text-gray-300">Hapus obrolan (pesan teks)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${deleteMediaChecked ? 'bg-primary-600 border-primary-600' : 'border-gray-500'}`}>
                      {deleteMediaChecked && <CheckIcon className="w-3 h-3 text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={deleteMediaChecked} onChange={(e) => setDeleteMediaChecked(e.target.checked)} />
                    <span className="text-sm text-gray-300">Hapus media (foto, video, dokumen)</span>
                  </label>
                </div>
                <div className="p-4 border-t border-primary-900/30 flex justify-end gap-3">
                  <button onClick={() => setIsDeleteRoomChatModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">
                    Batal
                  </button>
                  <button 
                    onClick={() => {
                      if (deleteObrolanChecked && deleteMediaChecked) {
                        setRoomMessages([]);
                      } else if (deleteObrolanChecked) {
                        setRoomMessages(prev => prev.filter(m => m.file != null));
                      } else if (deleteMediaChecked) {
                        setRoomMessages(prev => prev.filter(m => m.file == null));
                      }
                      setIsDeleteRoomChatModalOpen(false);
                    }}
                    disabled={!deleteObrolanChecked && !deleteMediaChecked}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Starred Sessions Sidebar */}
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

          {/* Starred Messages Sidebar */}
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
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-gray-400 hover:text-yellow-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity cursor-pointer"
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

          {/* Settings Modal */}
          {isSettingsMenuOpen && (
            <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-4 border-b border-primary-900/30 shrink-0">
                  <h2 className="text-lg font-orbitron font-bold text-primary-400">Settings</h2>
                  <button onClick={() => setIsSettingsMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-5 overflow-y-auto flex flex-col gap-6">
                  {/* Foto Profil */}
                  <div className="flex flex-col gap-3 items-center">
                    <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                      <div className="w-20 h-20 rounded-full bg-primary-900/30 border-2 border-primary-500/50 flex items-center justify-center overflow-hidden">
                        {userAvatar ? (
                          <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle className="w-10 h-10 text-primary-500/50" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                      <input type="file" ref={avatarInputRef} accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </div>
                    <h3 className="text-xs font-mono text-primary-400">Ubah Foto Profil</h3>
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
                        <button onClick={() => { setTempUserName(userName); setIsEditingUserName(true); }} className="p-2 bg-primary-900/30 text-primary-400 rounded-xl cursor-pointer"><Pencil className="w-4 h-4" /></button>
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
                         localStorage.setItem(STORAGE_KEY_PROMPT, systemPrompt);
                         setIsPromptSavedToast(true);
                         setTimeout(() => setIsPromptSavedToast(false), 3000);
                       }} className="text-xs bg-primary-600 px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1 cursor-pointer">
                         <Save className="w-3 h-3" /> Simpan Prompt
                       </button>
                    </div>
                    {isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan</p>}
                  </div>

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
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
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
                  <button onClick={handleLogout} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer text-sm">
                    Oke
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
'''

full_app = base_code + app_rest

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(full_app)

print("App.tsx restored properly.")
