const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add state for selected file preview
const stateRegex = /const \[isAttachmentMenuOpen, setIsAttachmentMenuOpen\] = useState<boolean>\(false\);/;
content = content.replace(stateRegex, `const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState<boolean>(false);\n  const [selectedFile, setSelectedFile] = useState<{name: string, dataUrl: string, type: string} | null>(null);`);

// 2. Modify handleFileChange to set state instead of auto-sending
const fileChangeRegex = /const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\};\n/m;
const newFileChange = `const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedFile({
          name: file.name,
          dataUrl: event.target?.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
      // Reset input
      e.target.value = '';
    }
  };\n`;
content = content.replace(fileChangeRegex, newFileChange);

// 3. Render preview above chat input
const inputFormRegex = /<form\s+onSubmit=\{\(e\) => \{\s+e\.preventDefault\(\);\s+if \(chatMode === 'ai'\) \{/m;
const previewComponent = `
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
              )}
`;
content = content.replace(inputFormRegex, previewComponent + `<form
              onSubmit={(e) => {
                e.preventDefault();
                if (chatMode === 'ai') {`);

fs.writeFileSync('src/App.tsx', content);
