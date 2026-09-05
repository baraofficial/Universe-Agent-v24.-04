import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Make chat area full screen without borders
chat_area_target = """        {/* 
        =======================================================================
        KONTEN UTAMA APLIKASI (TAB BASED)
        =======================================================================
        */}
        <main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-4 max-w-3xl">
          
          <section className="flex flex-col flex-1 bg-[#0E0E12]/90 border border-primary-900/50 rounded-3xl overflow-hidden backdrop-blur-xl relative animate-fade-in mb-4 sm:mb-6">"""

chat_area_replacement = """        {/* 
        =======================================================================
        KONTEN UTAMA APLIKASI
        =======================================================================
        */}
        <main className="flex-1 w-full mx-auto flex flex-col overflow-hidden max-w-4xl relative z-10">
          
          <section className="flex flex-col flex-1 relative animate-fade-in">"""

if chat_area_target in content:
    content = content.replace(chat_area_target, chat_area_replacement)
else:
    # Try alternate regex
    pattern_main = re.compile(r'<main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-4 max-w-3xl">\s*<section className="flex flex-col flex-1 relative animate-fade-in mb-4 sm:mb-6">', re.DOTALL)
    content = pattern_main.sub(chat_area_replacement, content)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Made Chat area full screen")
