import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix the messages map
content = re.sub(r'\{messages\.map\(\(msg\) => \{', r'{chatMode === \'ai\' && messages.map((msg) => {', content)

with open("src/App.tsx", "w") as f:
    f.write(content)
