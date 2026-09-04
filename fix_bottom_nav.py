import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace activeTab state definition with just removing it or ignoring it
content = re.sub(r"const \[activeTab, setActiveTab\] = useState<TabType>\('chat'\);", "", content)
content = re.sub(r"type TabType = 'chat' \| 'prompt' \| 'tools' \| 'history' \| 'account';", "", content)

# Remove the {activeTab === 'chat' && ( ... )} wrapper but keep the section
# Basically replace `{activeTab === 'chat' && (\n        <section` with `<section`
# And remove the matching `)}`
content = content.replace("{activeTab === 'chat' && (", "")
# Since we know `</section>\n      )}` is the end of the chat section, let's replace it
content = content.replace("</section>\n      )}", "</section>")

# Remove the bottom nav completely
bottom_nav_pattern = re.compile(r"\{\/\* ===================================================================\s*3\. BOTTOM NAVIGATION.*?<\/nav>", re.DOTALL)
content = bottom_nav_pattern.sub("", content)

# Adjust padding bottom on main
content = content.replace("pb-28", "pb-4")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Removed bottom nav")
