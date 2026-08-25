import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# 1. Add fileInputRef to the component
ref_insertion = """  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // --- UPLOAD FILE ---
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    setIsAttachmentMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendCommand(`Tolong proses file ini cak: ${file.name}`);
      // Reset input
      e.target.value = '';
    }
  };"""

code = code.replace("  const messagesEndRef = useRef<HTMLDivElement>(null);", ref_insertion)

# 2. Update the Upload File button and add the hidden input
old_upload_button = """                    <button 
                      type="button"
                      onClick={() => { setIsAttachmentMenuOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Upload File</span>
                    </button>"""

new_upload_button = """                    <button 
                      type="button"
                      onClick={handleFileUploadClick}
                      className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Upload File</span>
                    </button>"""

code = code.replace(old_upload_button, new_upload_button)

hidden_input = """              {/* Attachment Button & Menu */}
              <div className="relative shrink-0">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button"""

code = code.replace("""              {/* Attachment Button & Menu */}
              <div className="relative shrink-0">
                <button""", hidden_input)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Upload fixed")
