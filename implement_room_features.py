import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Imports
# Insert Framer Motion
if "import { motion } from 'motion/react';" not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { motion } from 'motion/react';")

# Ensure Menu, Reply, X are in lucide-react
lucide_target = ", ArrowDown, Rocket"
lucide_repl = ", Menu, Reply, X, ArrowDown, Rocket"
if "Menu, Reply, X" not in content:
    content = content.replace(lucide_target, lucide_repl)

# 2. Add new states
state_injection = """  const [socket, setSocket] = useState<Socket | null>(null);

  // --- ROOM CHAT SPECIFIC STATES ---
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [roomWallpaper, setRoomWallpaper] = useState<string | null>(null);
  const [roomWallpaperType, setRoomWallpaperType] = useState<'image' | 'video' | null>(null);
  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          window.URL.revokeObjectURL(video.src);
          if (video.duration > 20) {
            alert("Durasi video maksimal 20 detik cak!");
            return;
          }
          setRoomWallpaperType(type);
          const reader = new FileReader();
          reader.onload = (e) => setRoomWallpaper(e.target?.result as string);
          reader.readAsDataURL(file);
        }
        video.src = URL.createObjectURL(file);
      } else {
        setRoomWallpaperType(type);
        const reader = new FileReader();
        reader.onload = (e) => setRoomWallpaper(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };
"""
content = content.replace("  const [socket, setSocket] = useState<Socket | null>(null);", state_injection)

# Update handleSendRoomMessage
handle_send_target = """  const handleSendRoomMessage = (text: string, file?: any) => {
    if (!text.trim() && !file) return;
    
    const newMsg = {
      id: `room-${Date.now()}`,
      sender: 'user',
      senderName: userName || 'Anonim',
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      file: file ? { name: file.name } : null
    };
    
    setRoomMessages(prev => [...prev, newMsg]);
    socket?.emit("room_message", { ...newMsg, isMe: false });
  };"""

handle_send_replacement = """  const handleSendRoomMessage = (text: string, file?: any) => {
    if (!text.trim() && !file) return;
    
    const newMsg = {
      id: `room-${Date.now()}`,
      sender: 'user',
      senderName: userName || 'Anonim',
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      file: file ? { name: file.name } : null,
      replyTo: replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text } : null
    };
    
    setRoomMessages(prev => [...prev, newMsg]);
    socket?.emit("room_message", { ...newMsg, isMe: false });
    setReplyingTo(null);
  };"""

content = content.replace(handle_send_target, handle_send_replacement)

# 3. Add background element
bg_target = """<div className={`min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-${theme}`}>"""
bg_replacement = """<div className={`min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-${theme}`}>
        {chatMode === 'room' && roomWallpaper && (
          <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
            {roomWallpaperType === 'video' ? (
              <video autoPlay loop muted playsInline src={roomWallpaper} className="w-full h-full object-cover" />
            ) : (
              <img src={roomWallpaper} alt="Room Wallpaper" className="w-full h-full object-cover" />
            )}
          </div>
        )}"""
content = content.replace(bg_target, bg_replacement)

# 4. Header button
header_btn_target = """          <div className="w-12 h-12 flex items-center justify-end">
            <button 
              onClick={() => setIsSettingsMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            </button>
          </div>"""

header_btn_replacement = """          <div className="w-12 h-12 flex items-center justify-end">
            {chatMode === 'room' ? (
              <button 
                onClick={() => setIsRoomSettingsOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={() => setIsSettingsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
            )}
          </div>"""
content = content.replace(header_btn_target, header_btn_replacement)

# 5. Swipe to reply (motion.div)
room_msg_target = """   {chatMode === 'room' && roomMessages.map((msg) => {
     const isMe = msg.isMe;
     return (
       <div 
         key={msg.id}
         className={`flex items-start gap-3 sm:gap-4 ${isMe ? 'justify-end' : 'justify-start'}`}
       >"""
room_msg_replacement = """   {chatMode === 'room' && roomMessages.map((msg) => {
     const isMe = msg.isMe;
     return (
       <motion.div 
         key={msg.id}
         className={`flex items-start gap-3 sm:gap-4 ${isMe ? 'justify-end' : 'justify-start'}`}
         drag={!isMe ? "x" : false}
         dragConstraints={{ left: 0, right: 0 }}
         dragElastic={{ left: 0.5, right: 0 }}
         onDragEnd={(e, info) => {
           if (!isMe && info.offset.x < -40) {
             setReplyingTo(msg);
           }
         }}
       >"""
content = content.replace(room_msg_target, room_msg_replacement)

room_msg_end_target = """         {isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
       </div>
     );
   })}"""
room_msg_end_replacement = """         {isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
       </motion.div>
     );
   })}"""
content = content.replace(room_msg_end_target, room_msg_end_replacement)

# Reply bubble inside the message
msg_content_target = """           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>"""

msg_content_replacement = """           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>
             {msg.replyTo && (
               <div className="mb-2 p-2 rounded-lg bg-black/20 border-l-2 border-primary-500 text-xs">
                 <div className="text-primary-300 font-bold mb-0.5">{msg.replyTo.senderName}</div>
                 <div className="text-gray-300 line-clamp-2">{msg.replyTo.text}</div>
               </div>
             )}"""
content = content.replace(msg_content_target, msg_content_replacement)

# 6. Replying banner in input area
banner_replacement = """              {replyingTo && chatMode === 'room' && (
                <div className="absolute -top-12 left-0 right-0 px-4 py-2 bg-primary-900/90 border border-primary-500/50 rounded-2xl backdrop-blur-xl flex items-center justify-between text-sm shadow-xl z-10 mx-auto max-w-4xl w-full">
                  <div className="flex flex-col overflow-hidden max-w-[90%]">
                    <span className="text-primary-400 font-bold text-xs flex items-center gap-1"><Reply className="w-3 h-3"/> Membalas {replyingTo.senderName}</span>
                    <span className="text-gray-300 truncate text-xs">{replyingTo.text}</span>
                  </div>
                  <button type="button" onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-3xl shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">"""

content = content.replace("""              <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-3xl shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">""", banner_replacement)

# 7. Add Settings Modal
settings_modal_target = """      {/* Settings Modal (Gear Icon) */}"""
room_settings_modal = """      {/* Room Settings Modal */}
      {isRoomSettingsOpen && chatMode === 'room' && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsRoomSettingsOpen(false)}>
          <div 
            className="w-full max-w-sm bg-[#141416] border border-primary-900/50 rounded-3xl shadow-2xl overflow-hidden mt-12 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-primary-900/30 flex items-center justify-between">
              <h2 className="text-lg font-orbitron font-bold text-white">Setting Room Chat</h2>
              <button onClick={() => setIsRoomSettingsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Wallpaper Background</label>
                <input 
                  type="file" 
                  ref={wallpaperInputRef} 
                  onChange={handleWallpaperChange} 
                  accept="image/*,video/*"
                  className="hidden" 
                />
                <button 
                  onClick={() => wallpaperInputRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors cursor-pointer"
                >
                  Ganti Foto / Video (Maks 20s)
                </button>
                {roomWallpaper && (
                  <button 
                    onClick={() => { setRoomWallpaper(null); setRoomWallpaperType(null); }}
                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors mt-2 cursor-pointer"
                  >
                    Hapus Wallpaper
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal (Gear Icon) */}"""
content = content.replace(settings_modal_target, room_settings_modal)

with open("src/App.tsx", "w") as f:
    f.write(content)
