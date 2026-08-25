import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Fix margins for other tabs since main now has padding
code = code.replace(
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 m-3 sm:m-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md animate-fade-in"',
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md animate-fade-in flex-1 overflow-y-auto"'
)

code = code.replace(
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 m-3 sm:m-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md animate-fade-in min-h-full"',
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md animate-fade-in flex-1 overflow-y-auto"'
)

code = code.replace(
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 m-3 sm:m-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md flex-1 flex flex-col min-h-[50vh] max-h-[75vh] sm:max-h-[80vh] animate-fade-in"',
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md flex-1 flex flex-col animate-fade-in overflow-hidden"'
)

code = code.replace(
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-5 sm:p-6 m-3 sm:m-5 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md animate-fade-in"',
    'className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-5 sm:p-6 shadow-[0_0_20px_rgba(10,10,10,0.6)] backdrop-blur-md animate-fade-in flex-1 overflow-y-auto"'
)

# Fix scroll button position
code = code.replace(
    'className="absolute bottom-28 left-1/2 -translate-x-1/2 p-2 rounded-full bg-purple-600/80 hover:bg-purple-500 text-white shadow-lg animate-fade-in z-50 border border-purple-400 backdrop-blur-sm"',
    'className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-fade-in z-50 border border-purple-400 backdrop-blur-md transition-all"'
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("UI fixed 2")
