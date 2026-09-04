import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """  useEffect(() => {
    localStorage.setItem('bara_theme', theme);
  }, [theme]);"""

replacement = """  useEffect(() => {
    localStorage.setItem('bara_theme', theme);
    const root = document.documentElement;
    root.classList.remove('theme-blue', 'theme-green'); // purple is default in :root
    if (theme === 'blue') root.classList.add('theme-blue');
    if (theme === 'green') root.classList.add('theme-green');
  }, [theme]);"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Theme effect updated.")
else:
    print("Theme effect NOT FOUND.")
    # Maybe try regex
    pattern = re.compile(r"useEffect\(\(\) => \{\s*localStorage\.setItem\('bara_theme', theme\);\s*\}, \[theme\]\);", re.DOTALL)
    new_content = pattern.sub(replacement, content)
    if new_content != content:
        with open("src/App.tsx", "w") as f:
            f.write(new_content)
        print("Theme effect updated via regex.")
    else:
        print("Still NOT FOUND.")

