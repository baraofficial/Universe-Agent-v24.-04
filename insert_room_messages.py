import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = "     );\n   })}\n"
replacement = """     );
   })}
   
   {chatMode === 'room' && roomMessages.map((msg) => {
     const isMe = msg.isMe;
     return (
       <div 
         key={msg.id}
         className={`flex items-start gap-3 sm:gap-4 ${isMe ? 'justify-end' : 'justify-start'}`}
       >
         {!isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
         
         <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
           <div className="flex items-center gap-2 px-1">
             <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
               {msg.senderName}
             </span>
             <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
           </div>
           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>
             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.file && (
               <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                 <Folder className="w-3 h-3" /> {msg.file.name}
               </div>
             )}
           </div>
         </div>
         
         {isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
       </div>
     );
   })}
"""

if target in content:
    content = content.replace(target, replacement)
else:
    print("TARGET NOT FOUND!")

# Change Header to show Room Chat
header_target = """              <h1 className="text-sm font-bold tracking-widest text-primary-400 font-mono uppercase">
                Bara AI
              </h1>"""
header_replacement = """              <h1 className="text-sm font-bold tracking-widest text-primary-400 font-mono uppercase">
                {chatMode === 'ai' ? 'Bara AI' : 'Room Chat'}
              </h1>"""
if header_target in content:
    content = content.replace(header_target, header_replacement)

# Make isThinking condition respect chatMode
thinking_target = """{isThinking && ("""
thinking_replacement = """{isThinking && chatMode === 'ai' && ("""
content = content.replace(thinking_target, thinking_replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

