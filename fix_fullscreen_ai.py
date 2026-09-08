import re

with open("src/App.tsx", "r") as f:
    content = f.read()

main_target = """ <main className={`flex-1 w-full mx-auto flex flex-col overflow-hidden ${chatMode === 'room' ? 'p-0 max-w-full pb-0' : 'p-4 sm:p-6 md:p-8 pb-4 max-w-3xl'}`}>"""
main_repl = """ <main className="flex-1 w-full mx-auto flex flex-col overflow-hidden p-0 max-w-full pb-0">"""
content = content.replace(main_target, main_repl)

section_target = """ <section className={`flex flex-col flex-1 overflow-hidden relative animate-fade-in ${chatMode === 'room' ? 'bg-transparent border-none rounded-none mb-0' : 'bg-[#0E0E12]/90 border border-primary-900/50 rounded-3xl backdrop-blur-xl mb-4 sm:mb-6'}`}>"""
section_repl = """ <section className="flex flex-col flex-1 overflow-hidden relative animate-fade-in bg-transparent border-none rounded-none mb-0">"""
content = content.replace(section_target, section_repl)

with open("src/App.tsx", "w") as f:
    f.write(content)

