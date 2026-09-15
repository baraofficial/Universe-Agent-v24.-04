const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Update the file input to only accept images in AI mode
const fileInputRegex = /<input \s*type="file" \s*ref=\{fileInputRef\} \s*onChange=\{handleFileChange\} \s*className="hidden" \s*\/>/;
content = content.replace(fileInputRegex, '<input type="file" ref={fileInputRef} onChange={handleFileChange} accept={chatMode === \'ai\' ? \'image/*\' : undefined} className="hidden" />');

// 2. Update the preview box to handle videos and truncate text better
const previewRegex = /\{selectedFile\.type\.startsWith\('image\/'\) \? \([\s\S]*?<\/button>\s*<\/div>/;

const newPreview = `{selectedFile.type.startsWith('image/') ? (
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
                </div>`;

content = content.replace(previewRegex, newPreview);

// 3. Update the chat history rendering to show video player
const nonImageFileRegex = /\{msg\.file && !msg\.file\.type\?\.startsWith\('image\/'\) && \(/;
content = content.replace(nonImageFileRegex, `{msg.file && msg.file.type?.startsWith('video/') && (
               <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                 <video src={msg.file.dataUrl} controls className="w-full h-auto object-cover max-h-48" />
               </div>
             )}
             {msg.file && !msg.file.type?.startsWith('image/') && !msg.file.type?.startsWith('video/') && (`);

fs.writeFileSync('src/App.tsx', content);
