import re

with open("src/App.tsx", "r") as f:
    content = f.read()

start_idx = content.find("const CodeBlock = ({ content }")
end_idx = content.find("};", start_idx) + 2
# find the SECOND "};" because there is a nested return in some old code? No, let's just find "export default function App" and cut everything before it.
app_idx = content.find("export default function App")

print(f"Start: {start_idx}, App: {app_idx}")
