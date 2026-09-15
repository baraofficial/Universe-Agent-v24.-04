const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /<div className="whitespace-pre-wrap">\n\s*\{renderMessageText\(msg\.text\)\}\n\s*<\/div>/;

const newRender = `
            {msg.file && msg.file.type?.startsWith('image/') && (
               <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                 <img src={msg.file.dataUrl} alt="Upload" className="w-full h-auto object-cover max-h-32" />
               </div>
            )}
            <div className="whitespace-pre-wrap">
               {renderMessageText(msg.text)}
             </div>`;

content = content.replace(regex, newRender);
fs.writeFileSync('src/App.tsx', content);
