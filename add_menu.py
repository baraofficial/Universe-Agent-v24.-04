import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target_str = """          <div className="flex items-center gap-3">
            
            <div className="flex items-center gap-2">"""

replacement_str = """          <div className="flex items-center gap-3">
            
            <div className="relative">
              <button 
                onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
                className="p-2 -ml-2 rounded-xl bg-primary-900/10 text-primary-400 hover:bg-primary-900/30 hover:text-primary-300 transition-colors cursor-pointer"
                title="Menu"
              >
                <MoreVertical className="w-6 h-6" />
              </button>
              
              {isTopMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsTopMenuOpen(false)}></div>
                  <div className="absolute left-0 top-full mt-2 w-48 bg-[#120D22] border border-primary-900/50 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in py-1">
                    <button 
                      onClick={handleSaveChatFile}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-primary-900/30 hover:text-primary-300 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Simpan Chat
                    </button>
                    <button 
                      onClick={() => {
                        handleClearChat();
                        setIsTopMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-primary-900/30 hover:text-primary-300 flex items-center gap-3 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      New Chat
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">"""

if target_str in content:
    content = content.replace(target_str, replacement_str)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Added 3-dots menu.")
else:
    print("Could not find target to add menu. Attempting regex...")
    pattern = re.compile(r'<div className="flex items-center gap-3">\s*<div className="flex items-center gap-2">')
    
    if pattern.search(content):
        # The target without empty line
        content = pattern.sub(replacement_str.replace("          <div className=\"flex items-center gap-3\">\n            \n            <div className=\"flex items-center gap-2\">", "          <div className=\"flex items-center gap-3\">\n            <div className=\"flex items-center gap-2\">"), content)
        with open("src/App.tsx", "w") as f:
            f.write(content)
        print("Added via regex.")
    else:
        print("Still NOT FOUND.")

