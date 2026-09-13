const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// The problematic block:
const regex = /\{selectedFile && \([\s\S]*?<\/div>\s*\)\}\s*<form\s+onSubmit=\{\(e\) => \{[\s\S]*?\}\}\s+className="flex flex-col gap-3 relative max-w-4xl mx-auto"\s*>/;

const replacement = `<form
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
                  ) : (
                    <div className="w-16 h-16 bg-primary-900/30 flex items-center justify-center rounded-xl">
                      <FileCode className="w-8 h-8 text-primary-400" />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-sm font-medium text-gray-200 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-primary-400">Siap dikirim</span>
                  </div>
                  <button type="button" onClick={() => setSelectedFile(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
