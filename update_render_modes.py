import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Make the chat rendering conditional
chat_rendering_target = """ <div    ref={chatContainerRef}   onScroll={handleScroll}   className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" >   {messages.map((msg) => {"""

chat_rendering_replacement = """ <div    ref={chatContainerRef}   onScroll={handleScroll}   className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" >   
   {chatMode === 'ai' && messages.map((msg) => {"""

content = content.replace(chat_rendering_target, chat_rendering_replacement)

# End of AI messages loop and start of Room messages loop
ai_messages_end_target = """     );   })}      {/* """

room_messages_logic = """     );   })}
   
   {chatMode === 'room' && roomMessages.map((msg) => {
     const isMe = msg.isMe;
     return (
       <div 
         key={msg.id}
         className={`flex items-start gap-3 sm:gap-4 ${isMe ? 'justify-end' : 'justify-start'}`}
       >
         {!isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
         
         <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
           <div className="flex items-center gap-2 px-1">
             <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
               {isMe ? (userName || 'USER (Cak)') : msg.senderName}
             </span>
             <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
           </div>
           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>
             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.file && (
               <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                 <Folder className="w-3 h-3" /> {msg.file.name}
               </div>
             )}
           </div>
         </div>
         
         {isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
       </div>
     );
   })}

      {/* """
content = content.replace(ai_messages_end_target, room_messages_logic)

# Replace the input area
input_target_re = re.compile(r'\{\/\* \s*===================================================================\s*3\. INPUT AREA\s*===================================================================\s*\*\/.*?<\/form>\s*<\/div>', re.DOTALL)

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
                if (chatMode === 'ai') {
                  handleSendCommand();
                } else {
                  handleSendRoomMessage(inputCommand);
                  setInputCommand('');
                }
              }}
              className="flex flex-col gap-3 relative max-w-4xl mx-auto"
            >
              <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-3xl shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">
                
                {/* Attachment Button */}
                <div className="relative shrink-0 flex items-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  
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

                {/* Textarea */}
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

                {/* Tombol Kirim */}
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
          </div>"""

content = input_target_re.sub(input_replacement, content)

with open("src/App.tsx", "w") as f:
    f.write(content)
