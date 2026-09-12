const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="whitespace-pre-wrap">\s*\{msg\.text\}\s*<\/div>\s*\{msg\.isEdited && <div className="text-\[10px\] text-gray-500 mt-1 italic">\(diedit\)<\/div>\}\s*\{msg\.file && \(\s*<div className="mt-2 text-xs text-primary-300 flex items-center gap-1">\s*<FileCode className="w-3 h-3" \/>\s*\{msg\.file\.name\}\s*<\/div>\s*\)\}/;

const replacement = `{msg.file && msg.file.type?.startsWith('image/') && (
               <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                 <img src={msg.file.dataUrl || msg.file.url} alt="Upload" className="w-full h-auto object-cover max-h-64" />
               </div>
             )}
             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.isEdited && <div className="text-[10px] text-gray-500 mt-1 italic">(diedit)</div>}
             {msg.file && !msg.file.type?.startsWith('image/') && (
               <div className="mt-2 flex items-center gap-2 p-2 bg-black/20 rounded-lg">
                 <FileCode className="w-4 h-4 text-primary-400" />
                 <span className="text-xs text-primary-300">{msg.file.name}</span>
               </div>
             )}`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
