import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

code = code.replace(
    '<Activity className="w-4 h-4 text-purple-400 animate-pulse" />',
    ''
)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Icon removed")
