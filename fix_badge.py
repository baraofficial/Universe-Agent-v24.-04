import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("setActiveToolBadge(null);", "")
content = content.replace("setActiveToolBadge(result.toolUsed || 'Umum');", "")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Fixed setActiveToolBadge references.")
