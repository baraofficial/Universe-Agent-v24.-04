import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """                <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {renderMessageText(msg.text)}
                </div>
              </div>"""

replacement = """                <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {renderMessageText(msg.text)}
                </div>
                
                {/* ACTION BAR (IKON COPY, THUMBS UP, THUMBS DOWN) */}
                {isAi && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-gray-500">
                    <button onClick={() => navigator.clipboard.writeText(msg.text)} className="p-1.5 hover:bg-white/5 rounded-lg hover:text-primary-300 transition-all cursor-pointer" title="Salin pesan">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded-lg hover:text-primary-300 transition-all cursor-pointer" title="Jawaban bagus">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 hover:bg-white/5 rounded-lg hover:text-primary-300 transition-all cursor-pointer" title="Jawaban buruk">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Success replacing icons")
else:
    print("Target not found")
