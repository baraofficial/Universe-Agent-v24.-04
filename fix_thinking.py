import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Remove the text span entirely for the thinking indicator
content = re.sub(r'<span className="text-sm font-mono text-primary-300 font-medium tracking-wide">\s*Agent sedang berpikir...\s*</span>', '', content)

with open("src/App.tsx", "w") as f:
    f.write(content)
