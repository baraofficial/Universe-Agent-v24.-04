import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Remove the hamburger button
hamburger_btn = """            <button 
              onClick={() => setIsToolsMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl bg-primary-900/20 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>"""

content = content.replace(hamburger_btn, "")

# Remove the modal
modal_pattern = re.compile(r"\{\s*\/\* Tools Modal \(Hamburger Menu\).*?\}\s*\)", re.DOTALL)
content = modal_pattern.sub("", content)

# Remove the active tool badge rendering
badge_pattern = re.compile(r"\{activeToolBadge && \(.*?\}\s*\)", re.DOTALL)
content = badge_pattern.sub("", content)

# Remove tool badges from memory
content = re.sub(r"const \[activeToolBadge, setActiveToolBadge\] = useState<string \| null>\(null\);", "", content)
content = re.sub(r"const \[isToolsMenuOpen, setIsToolsMenuOpen\] = useState\(false\);", "", content)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Removed hamburger menu")
