import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace("Camera, ArrowDown", "Camera, ArrowDown, Download")

download_button = """              <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">
                    <Download className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Source Code</p>
                    <a href="/bara-agent-source.zip" download="bara-agent-source.zip" className="text-sm font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer">
                      Download Full Source Code (.zip)
                    </a>
                  </div>
                </div>
              </div>"""

content = content.replace('              <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">\n                <div className="flex items-center gap-3">\n                  <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">\n                    <ShieldAlert className="w-5 h-5 text-purple-300" />', download_button + '\n' + '              <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">\n                <div className="flex items-center gap-3">\n                  <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">\n                    <ShieldAlert className="w-5 h-5 text-purple-300" />')

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Added download button")
