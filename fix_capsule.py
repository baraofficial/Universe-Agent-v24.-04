import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl blur-md opacity-75 animate-pulse" />
                <div className="relative bg-[#140F2A] border border-primary-500/50 p-2.5 rounded-xl ">
                  <Wrench className="w-6 h-6 text-primary-400" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-primary-400 font-orbitron glow-primary-text">
                  Bara AI
                </h1>
                <p className="text-[10px] text-primary-300/70 font-mono hidden sm:block">
                  [AUTONOMOUS AI SYSTEM]
                </p>
              </div>
            </div>"""

replacement = """            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full blur-md opacity-50 animate-pulse" />
                <div className="relative bg-[#140F2A] border border-primary-500/50 p-2 rounded-full">
                  <Bot className="w-5 h-5 text-primary-400" />
                </div>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#130E24] border border-primary-500/40 shadow-[0_0_15px_rgba(var(--primary-600),0.15)]">
                <h1 className="text-base sm:text-lg font-black tracking-wider text-primary-400 font-orbitron glow-primary-text">
                  Bara AI
                </h1>
                <div className="hidden sm:flex items-center gap-2 border-l border-primary-900/50 pl-2 ml-1">
                  <p className="text-[10px] text-primary-300/70 font-mono">
                    [SYSTEM ONLINE]
                  </p>
                </div>
              </div>
            </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Replaced with capsule.")
else:
    print("Target not found.")

