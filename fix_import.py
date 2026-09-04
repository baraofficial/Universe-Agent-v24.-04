import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("} , MoreVertical } from 'lucide-react';", ", MoreVertical } from 'lucide-react';")

with open("src/App.tsx", "w") as f:
    f.write(content)
