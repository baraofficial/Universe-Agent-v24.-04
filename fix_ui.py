import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Make sure icons are imported: Trash, Star, Pin, LogOut, Trash2
icons_import_target = "UserCircle, Users, Image as ImageIcon2, Folder,"
icons_import_repl = "UserCircle, Users, Image as ImageIcon2, Folder, Star, Pin, LogOut, Pencil,"
if "Star, Pin," not in content:
    content = content.replace(icons_import_target, icons_import_repl)

# Add state for Popups in Settings and Room Chat Long Press
state_inject = """  // --- UI STATE POPUPS ---
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // --- ROOM CHAT INTERACTION STATE ---
  const [selectedRoomMessage, setSelectedRoomMessage] = useState<any>(null);
  
  const handleRoomMessageAction = (action: 'delete' | 'star' | 'pin') => {
    if (!selectedRoomMessage) return;
    
    // Simulate updating local state for star/pin
    if (action === 'delete') {
       setRoomMessages(prev => prev.filter(m => m.id !== selectedRoomMessage.id));
    } else {
       setRoomMessages(prev => prev.map(m => m.id === selectedRoomMessage.id ? { ...m, [action]: !m[action] } : m));
    }
    setSelectedRoomMessage(null);
  };
"""

content = content.replace("  // --- ROOM CHAT SPECIFIC STATES ---", state_inject + "\n  // --- ROOM CHAT SPECIFIC STATES ---")

with open("src/App.tsx", "w") as f:
    f.write(content)
