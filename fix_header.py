import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_header = """          {/* Header Internal Area Chat */}
          <div className="px-4 py-3 border-b border-purple-900/30 bg-[#120D22]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              
            </div>
            {activeToolBadge && (
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/50 text-purple-200 text-[11px] font-mono animate-fade-in">
                <Zap className="w-3 h-3 text-purple-300" />
                <span>Tool Aktif: {activeToolBadge}</span>
              </div>
            )}
          </div>"""

new_header = """          {/* Header Internal Area Chat */}
          {activeToolBadge && (
            <div className="px-4 py-2.5 border-b border-purple-900/30 bg-[#120D22]/60 flex items-center justify-end">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/50 text-purple-200 text-[11px] font-mono animate-fade-in">
                <Zap className="w-3 h-3 text-purple-300" />
                <span>Tool Aktif: {activeToolBadge}</span>
              </div>
            </div>
          )}"""

code = code.replace(old_header, new_header)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Header fixed")
