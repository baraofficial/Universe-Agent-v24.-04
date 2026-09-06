import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the remaining references
content = re.sub(r'\{googleUser\?.photoURL \? \(.*?\n.*?<img src=\{googleUser.photoURL\}.*?\n.*?\)\ : \(.*?\n.*?<UserCircle.*?\n.*?\)\}', r'<UserCircle className="w-6 h-6 text-primary-500/50" />', content, flags=re.DOTALL)

# Fix settings modal
settings_pattern = re.compile(r'                <h3 className="text-xs font-mono text-primary-300 uppercase">Akun Google</h3>\s*\{googleUser \? \(.*?</button>\s*\)\}', re.DOTALL)
content = settings_pattern.sub('', content)

with open("src/App.tsx", "w") as f:
    f.write(content)
