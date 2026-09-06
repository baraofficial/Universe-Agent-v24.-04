import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Add io import
if "import { io " not in content:
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", "import React, { useState, useEffect, useRef } from 'react';\nimport { io, Socket } from 'socket.io-client';")

# 2. Add socket state and mode
state_injection = """
  // --- STATE ROOM CHAT ---
  const [chatMode, setChatMode] = useState<'ai' | 'room'>('ai');
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    
    newSocket.on("room_message", (msg) => {
      setRoomMessages(prev => [...prev, msg]);
    });
    
    return () => {
      newSocket.close();
    };
  }, []);

  const handleSendRoomMessage = (text: string, file?: any) => {
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
  };
  
  // --- STATE BOTTOM NAV ---"""
  
content = content.replace("// --- STATE BOTTOM NAV ---", state_injection)

# 3. Add Sidebar button for Room Chat
sidebar_btn_target = """                    <button 
                      onClick={() => {
                        handleClearChat();
                        setIsTopMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      New Chat
                    </button>"""

sidebar_btn_replacement = """                    <button 
                      onClick={() => {
                        setChatMode('room');
                        setIsTopMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-[#1A1A24] hover:bg-primary-900/30 border border-primary-500/30 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium"
                    >
                      <Users className="w-5 h-5 text-primary-400" />
                      Room Chat
                    </button>
                    
                    <button 
                      onClick={() => {
                        setChatMode('ai');
                        handleClearChat();
                        setIsTopMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      New Chat
                    </button>"""

content = content.replace(sidebar_btn_target, sidebar_btn_replacement)

# Make sure Users icon is imported from lucide-react
if "Users" not in content[:1000]:
    content = content.replace("UserCircle,", "UserCircle, Users, Image as ImageIcon2, Folder,")

with open("src/App.tsx", "w") as f:
    f.write(content)
