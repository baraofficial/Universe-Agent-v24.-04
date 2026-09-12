const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const sendRoomMsgRegex = /const handleSendRoomMessage = \(text: string, file\?: any\) => \{[\s\S]*?if \(!text\.trim\(\) && !file\) \{/;
const newSendRoomMsg = `const handleSendRoomMessage = (text: string) => {
    if (!text.trim() && !selectedFile) {`;
content = content.replace(sendRoomMsgRegex, newSendRoomMsg);

const newMsgRegex = /file: file \? \{ name: file\.name \} : null,/g;
const replaceNewMsg = `file: selectedFile ? { name: selectedFile.name, dataUrl: selectedFile.dataUrl, type: selectedFile.type } : null,`;
content = content.replace(newMsgRegex, replaceNewMsg);

const sendRoomMsgBottom = /setReplyingTo\(null\);\n  \};/g;
const newSendRoomMsgBottom = `setReplyingTo(null);\n    setSelectedFile(null);\n  };`;
content = content.replace(sendRoomMsgBottom, newSendRoomMsgBottom);


// Modify handleSendCommand
const sendCommandRegex = /const handleSendCommand = async \(command\?: string\) => \{/g;
const replaceSendCommand = `const handleSendCommand = async (command?: string) => {
    const textToSend = command || inputCommand;
    if (!textToSend.trim() && !selectedFile) return;

    let finalPrompt = textToSend.trim();
    if (selectedFile && !finalPrompt) {
      finalPrompt = \`Tolong proses file ini cak: \${selectedFile.name}\`;
    } else if (selectedFile && finalPrompt) {
      finalPrompt = \`\${finalPrompt}\\n[File attached: \${selectedFile.name}]\`;
    }
    
    // Clear selection early
    setSelectedFile(null);
    setInputCommand('');
`;

content = content.replace(/const handleSendCommand = async \(command\?: string\) => \{\n    const textToSend = command \|\| inputCommand;\n    if \(\!textToSend\.trim\(\)\) return;\n    \n    setInputCommand\(''\);\n/g, replaceSendCommand);


// Render the image in Room Messages
const renderRoomMsgRegex = /<p className="text-sm sm:text-base text-gray-200 whitespace-pre-wrap break-words leading-relaxed">\{msg\.text\}<\/p>/g;
const replaceRenderRoomMsg = `{msg.file && msg.file.type?.startsWith('image/') && (
                <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
                  <img src={msg.file.dataUrl} alt="Upload" className="w-full h-auto object-cover" />
                </div>
              )}
              {msg.text && <p className="text-sm sm:text-base text-gray-200 whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>}
              {msg.file && !msg.file.type?.startsWith('image/') && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-black/20 rounded-lg">
                  <FileCode className="w-5 h-5 text-primary-400" />
                  <span className="text-xs text-primary-300">{msg.file.name}</span>
                </div>
              )}`;
content = content.replace(renderRoomMsgRegex, replaceRenderRoomMsg);

fs.writeFileSync('src/App.tsx', content);
