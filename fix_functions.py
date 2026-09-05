import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = "// Menyimpan riwayat percakapan chat"
replacement = """const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, feedback: msg.feedback === type ? undefined : type } : msg
    ));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Menyimpan riwayat percakapan chat"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Added handleFeedback and handleCopy.")
else:
    print("Could not find target.")
