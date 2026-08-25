import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Fix layout: put padding back on main, and make chat section boxed
main_old = '<main className="flex-1 w-full mx-auto flex flex-col overflow-hidden pb-24 max-w-3xl">'
main_new = '<main className="flex-1 w-full mx-auto p-2 sm:p-4 flex flex-col overflow-hidden pb-24 max-w-3xl">'
code = code.replace(main_old, main_new)

section_old = '<section className="flex flex-col flex-1 bg-transparent overflow-hidden relative animate-fade-in">'
section_new = '<section className="flex flex-col flex-1 bg-[#0E0E12]/80 border border-purple-900/40 rounded-2xl shadow-[0_0_30px_rgba(10,10,10,0.8)] overflow-hidden backdrop-blur-md relative animate-fade-in">'
code = code.replace(section_old, section_new)

# Improve handleScroll
scroll_old = """  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    if (scrollHeight - scrollTop - clientHeight > 100) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };"""
scroll_new = """  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop - target.clientHeight > 50) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };"""
code = code.replace(scroll_old, scroll_new)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("UI fixed")
