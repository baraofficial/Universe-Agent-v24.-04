import re

with open("src/App.tsx", "r") as f:
    content = f.read()

state_target = "const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);"
state_replacement = """const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);

  const handleSaveChatFile = () => {
    if (messages.length === 0) return;
    
    let chatContent = "# Bara AI - Chat History\\n\\n";
    messages.forEach(msg => {
      const senderName = msg.sender === 'user' ? (googleUser?.displayName || 'User (Cak)') : 'Bara AI';
      chatContent += `[${msg.timestamp}] ${senderName}:\\n${msg.text}\\n\\n`;
    });
    
    const blob = new Blob([chatContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bara_AI_Chat_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsTopMenuOpen(false);
  };"""

if state_target in content:
    content = content.replace(state_target, state_replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Injected state and functions successfully.")
else:
    print("Could not find target to inject state and functions.")
