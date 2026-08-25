import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Fix handleScroll
old_scroll = """  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollHeight - target.scrollTop - target.clientHeight > 50) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };"""
new_scroll = """  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShowScrollButton(!isAtBottom);
  };"""
code = code.replace(old_scroll, new_scroll)

# Fix scroll button position and style
old_button = """          {showScrollButton && (
            <button 
              onClick={() => chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="absolute bottom-32 sm:bottom-36 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-purple-600/90 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-fade-in z-50 border border-purple-400 backdrop-blur-md transition-all"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          )}"""
new_button = """          {showScrollButton && (
            <button 
              onClick={() => {
                chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
                setShowScrollButton(false);
              }}
              className="absolute bottom-[130px] sm:bottom-[150px] left-1/2 -translate-x-1/2 p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.8)] animate-bounce z-50 border border-purple-400 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          )}"""
code = code.replace(old_button, new_button)

# Fix main padding to make it less "full"
old_main = '<main className="flex-1 w-full mx-auto p-2 sm:p-4 flex flex-col overflow-hidden pb-24 max-w-3xl">'
new_main = '<main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-28 max-w-3xl">'
code = code.replace(old_main, new_main)

# Add a bit of border radius and margin to section for less full look if needed
old_section = '<section className="flex flex-col flex-1 bg-[#0E0E12]/80 border border-purple-900/40 rounded-2xl shadow-[0_0_30px_rgba(10,10,10,0.8)] overflow-hidden backdrop-blur-md relative animate-fade-in">'
new_section = '<section className="flex flex-col flex-1 bg-[#0E0E12]/90 border border-purple-900/50 rounded-3xl shadow-[0_0_40px_rgba(10,10,10,0.9)] overflow-hidden backdrop-blur-xl relative animate-fade-in mb-4 sm:mb-6">'
code = code.replace(old_section, new_section)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Fixed scroll and layout")
