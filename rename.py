import os
import re

files_to_update = ['src/App.tsx', 'server.ts', 'api/chat.ts', 'index.html', 'metadata.json']

for filename in files_to_update:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        # Case sensitive replacements
        content = content.replace("Bara Agent", "Bara AI")
        content = content.replace("bara agent", "bara ai")
        content = content.replace("BARA AGENT", "BARA AI")
        content = content.replace("bara_agent", "bara_ai")
        content = content.replace("Bara_Agent", "Bara_AI")
        
        with open(filename, 'w') as f:
            f.write(content)
        print(f"Updated {filename}")

