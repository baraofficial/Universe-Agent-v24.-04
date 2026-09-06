with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(r"chatMode === \\'ai\\' &&", r"chatMode === 'ai' &&")
content = content.replace(r"chatMode === \'ai\' &&", r"chatMode === 'ai' &&")

with open("src/App.tsx", "w") as f:
    f.write(content)
