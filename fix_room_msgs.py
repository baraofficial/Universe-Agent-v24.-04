import re

with open("src/App.tsx", "r") as f:
    content = f.read()

msg_div_target = """           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>"""

msg_div_replacement = """           <div 
             onContextMenu={(e) => { e.preventDefault(); setSelectedRoomMessage(msg); }}
             className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed cursor-pointer transition-colors hover:brightness-110 ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           } ${msg.pin ? 'border-amber-500/50' : ''}`}>"""

content = content.replace(msg_div_target, msg_div_replacement)

# Inside the message div, add indicators
msg_text_target = """             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.file && (
               <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                 <Folder className="w-3 h-3" /> {msg.file.name}
               </div>
             )}
           </div>
         </div>"""

msg_text_replacement = """             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.file && (
               <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                 <Folder className="w-3 h-3" /> {msg.file.name}
               </div>
             )}
           </div>
           {/* Pencil Icon & Indicators */}
           <div className={`flex items-center gap-2 px-1 mt-0.5 text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
             {msg.star && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
             {msg.pin && <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />}
             {isMe && (
               <button className="p-0.5 hover:text-primary-400 transition-colors">
                 <Pencil className="w-3 h-3" />
               </button>
             )}
           </div>
         </div>"""

content = content.replace(msg_text_target, msg_text_replacement)

# Add the Room Message Action Modal popup at the root layout 
# (just before the Settings Modal)
modal_injection_target = """      {/* Room Settings Modal */}"""
room_action_modal = """      {/* Room Message Action Popup */}
      {selectedRoomMessage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedRoomMessage(null)}>
          <div 
            className="w-full max-w-xs bg-[#141416] border border-primary-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-primary-900/30">
              <p className="text-gray-300 text-sm line-clamp-2 italic">"{selectedRoomMessage.text}"</p>
            </div>
            <div className="p-2 flex justify-around">
              <button 
                onClick={() => handleRoomMessageAction('delete')}
                className="flex-1 flex flex-col items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-xs font-medium">Hapus</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('star')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${selectedRoomMessage.star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Star className={`w-5 h-5 ${selectedRoomMessage.star ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">Bintang</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('pin')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${selectedRoomMessage.pin ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Pin className={`w-5 h-5 ${selectedRoomMessage.pin ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">Sematkan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Settings Modal */}"""

content = content.replace(modal_injection_target, room_action_modal)

with open("src/App.tsx", "w") as f:
    f.write(content)

