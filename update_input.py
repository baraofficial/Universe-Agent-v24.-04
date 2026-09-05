import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Update Input Area styling
input_target = """ {/* 
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
 <Github className="w-4 h-4 text-primary-400" />
 <span>Impor Repo Github</span>
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
 <div className="flex-1 relative">
 <textarea
 value={inputCommand}
 onChange={(e) => setInputCommand(e.target.value)}
 onKeyDown={(e) => {
 // Enter tanpa Shift = Kirim pesan
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSendCommand();
 }
 }}
 disabled={isThinking}
 placeholder="Perintahkan aku cak..."
 rows={1}
 className="w-full h-[52px] sm:h-[58px] bg-[#0A0A0E] border border-primary-500/40 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-xl pl-4 pr-4 sm:pr-24 py-3 sm:py-4 text-sm sm:text-base text-gray-100 placeholder-primary-400/50 resize-none transition-all disabled:opacity-60"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono hidden sm:block">
 Enter ↵ untuk kirim
 </div>
 </div>

 {/* Tombol "Kirim Perintah" warna ungu neon glow */}
 <button
 type="submit"
 disabled={!inputCommand.trim() || isThinking}
 className="h-[52px] sm:h-[58px] px-5 sm:px-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-orbitron text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer hover: active:scale-95 disabled:cursor-not-allowed disabled: shrink-0"
 >
 <Send className="w-4 h-4" />
 <span className="hidden sm:inline">Kirim Perintah</span>
 </button>
 </form>
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
              <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-3xl shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">
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
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendCommand();
                      }
                    }}
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
                    <Send className={`w-4 h-4 ${(inputCommand.trim() || attachedFile) ? 'ml-0.5 -mt-0.5' : 'ml-0.5'}`} />
                  )}
                </button>
              </div>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-500 font-mono">Bara AI dapat membuat kesalahan. Periksa info penting.</p>
              </div>
            </form>
          </div>"""

# Ensure exact formatting match or fallback to regex
content = content.replace(input_target, input_replacement)
if input_target not in content:
    pattern_input = re.compile(r'\{/\* \s*===================================================================\s*3\. INPUT AREA.*?</form>\s*</div>', re.DOTALL)
    content = pattern_input.sub(input_replacement, content)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Updated Input area.")
