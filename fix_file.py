import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                {/* Textarea */}
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
                </button>"""

replacement = """                {/* Textarea */}
                <div className="flex-1 px-3 py-1 flex items-center">
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
                  disabled={isThinking || !inputCommand.trim()}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all cursor-pointer mr-1 ${
                    inputCommand.trim()
                      ? 'bg-primary-700 hover:bg-primary-600 text-white' 
                      : 'bg-primary-900/30 text-primary-500/50'
                  }`}
                >
                  {isThinking ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className={`w-4 h-4 ${inputCommand.trim() ? 'ml-0.5 -mt-0.5' : 'ml-0.5'}`} />
                  )}
                </button>"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Fixed attachedFile.")
else:
    print("Could not find target.")
