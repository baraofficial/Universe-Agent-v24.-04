const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="whitespace-pre-wrap">\s*\{msg\.text\}\s*<\/div>\s*\{msg\.isEdited && <div className="text-\[10px\] text-gray-500 mt-1 italic">\(diedit\)<\/div>\}\s*\{msg\.file && \(\s*<div className="mt-2 text-xs text-primary-300 flex items-center gap-1">\s*<Folder className="w-3 h-3" \/> \{msg\.file\.name\}\s*<\/div>\s*\)\}/;

const replacement = `{msg.file && msg.file.type?.startsWith('image/') && (
               <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                 <img src={msg.file.dataUrl} alt="Upload" className="w-full h-auto object-cover max-h-64" />
               </div>
             )}
             {msg.text && (
               <div className="whitespace-pre-wrap">
                 {msg.text}
               </div>
             )}
             {msg.isEdited && <div className="text-[10px] text-gray-500 mt-1 italic">(diedit)</div>}
             {msg.file && !msg.file.type?.startsWith('image/') && (
               <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                 <Folder className="w-3 h-3" /> {msg.file.name}
               </div>
             )}`;

content = content.replace(regex, replacement);

fs.writeFileSync('src/App.tsx', content);
