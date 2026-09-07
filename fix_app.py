import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. State for editing room message
state_target = """  // --- ROOM CHAT INTERACTION STATE ---
  const [selectedRoomMessage, setSelectedRoomMessage] = useState<any>(null);"""
state_repl = """  // --- ROOM CHAT INTERACTION STATE ---
  const [selectedRoomMessage, setSelectedRoomMessage] = useState<any>(null);
  const [editingRoomMessageId, setEditingRoomMessageId] = useState<string | null>(null);"""
content = content.replace(state_target, state_repl)

# 2. Add socket listener for update_room_message
socket_target = """    newSocket.on("room_message", (msg) => {
      setRoomMessages(prev => [...prev, msg]);
    });"""
socket_repl = """    newSocket.on("room_message", (msg) => {
      setRoomMessages(prev => [...prev, msg]);
    });
    
    newSocket.on("update_room_message", (updatedMsg) => {
      setRoomMessages(prev => prev.map(m => m.id === updatedMsg.id ? { ...m, text: updatedMsg.text, isEdited: true } : m));
    });"""
content = content.replace(socket_target, socket_repl)

# 3. Handle edit message logic
handle_target = """  const handleSendRoomMessage = (text: string, file?: any) => {
    if (!text.trim() && !file) return;"""
handle_repl = """  const handleSendRoomMessage = (text: string, file?: any) => {
    if (!text.trim() && !file) return;
    
    if (editingRoomMessageId) {
      setRoomMessages(prev => prev.map(msg => 
        msg.id === editingRoomMessageId ? { ...msg, text: text, isEdited: true } : msg
      ));
      socket?.emit("update_room_message", { id: editingRoomMessageId, text: text });
      setEditingRoomMessageId(null);
      return;
    }"""
content = content.replace(handle_target, handle_repl)

# 4. Modify pencil icon to enter edit mode
pencil_target = """             {isMe && (
               <button className="p-0.5 hover:text-primary-400 transition-colors">
                 <Pencil className="w-3 h-3" />
               </button>
             )}"""
pencil_repl = """             {isMe && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setEditingRoomMessageId(msg.id);
                   setInputCommand(msg.text);
                 }}
                 className="p-0.5 hover:text-primary-400 transition-colors cursor-pointer"
               >
                 <Pencil className="w-3 h-3" />
               </button>
             )}"""
content = content.replace(pencil_target, pencil_repl)

# 5. Show edited indicator and edit mode banner
# Edited indicator:
msg_text_target = """             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>"""
msg_text_repl = """             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.isEdited && <div className="text-[10px] text-gray-500 mt-1 italic">(diedit)</div>}"""
content = content.replace(msg_text_target, msg_text_repl)

# Edit mode banner in the input area
banner_target = """              {replyingTo && chatMode === 'room' && ("""
banner_repl = """              {editingRoomMessageId && chatMode === 'room' && (
                <div className="absolute -top-12 left-0 right-0 px-4 py-2 bg-primary-900/90 border border-primary-500/50 rounded-2xl backdrop-blur-xl flex items-center justify-between text-sm shadow-xl z-10 mx-auto max-w-4xl w-full">
                  <div className="flex flex-col overflow-hidden max-w-[90%]">
                    <span className="text-primary-400 font-bold text-xs flex items-center gap-1"><Pencil className="w-3 h-3"/> Mengedit Pesan</span>
                  </div>
                  <button type="button" onClick={() => { setEditingRoomMessageId(null); setInputCommand(''); }} className="p-1 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {replyingTo && !editingRoomMessageId && chatMode === 'room' && ("""
content = content.replace(banner_target, banner_repl)

with open("src/App.tsx", "w") as f:
    f.write(content)

