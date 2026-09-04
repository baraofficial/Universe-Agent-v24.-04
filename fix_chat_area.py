import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """ <div className="px-4 py-3 border-b border-primary-900/30 bg-[#120D22]/60 flex items-center justify-between">
 <div className="flex items-center gap-2">
  
 
 </div>
      {/* 
      -----------------------------------------------------------------
      SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")"""

new_content = """ <div className="px-4 py-3 border-b border-primary-900/30 bg-[#120D22]/60 flex items-center justify-between">
   <div className="flex items-center gap-2">
     <h2 className="text-sm font-semibold text-primary-300 font-orbitron">Bara AI Terminal</h2>
   </div>
 </div>

 {/* 2. CHAT AREA */}
 <div 
   ref={chatContainerRef}
   onScroll={handleScroll}
   className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
 >
   {messages.map((msg) => {
     const isAi = msg.sender === 'ai';
     return (
       <div 
         key={msg.id}
         className={`flex items-start gap-3 sm:gap-4 ${
           isAi ? 'justify-start' : 'justify-end'
         }`}
       >
         {/* Avatar AI Agent (sebelah kiri bubble AI) */}
         {isAi && (
           <div className="flex-shrink-0 relative mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-950 border border-primary-400/60 flex items-center justify-center ">
               <Bot className="w-5 h-5 text-primary-200" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]" />
           </div>
         )}
         
         {/* Bubble Chat */}
         <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${
           isAi ? 'items-start' : 'items-end'
         }`}>
           <div className="flex items-center gap-2 px-1">
             <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
               {isAi ? 'Bara AI' : (googleUser?.displayName || 'USER (Cak)')}
             </span>
             <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
           </div>
           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             isAi 
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>
             <div className="whitespace-pre-wrap">
               {renderMessageText(msg.text)}
             </div>
             
             {isAi && msg.toolUsed && (
               <div className="mt-3 pt-3 border-t border-primary-900/30 flex items-center justify-between">
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-900/20 border border-primary-900/30 text-[10px] font-mono text-primary-400">
                   <Wrench className="w-3 h-3" />
                   <span>Tool: {msg.toolUsed}</span>
                 </div>
               </div>
             )}
           </div>
         </div>
         
         {/* Avatar User (sebelah kanan bubble user) */}
         {!isAi && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               {googleUser?.photoURL ? (
                 <img src={googleUser.photoURL} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <UserCircle className="w-6 h-6 text-primary-500/50" />
               )}
             </div>
           </div>
         )}
       </div>
     );
   })}

      {/* 
      -----------------------------------------------------------------
      SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")"""

if target in content:
    content = content.replace(target, new_content)
    with open("src/App.tsx", "w") as f:
        f.write(content)
    print("Chat Area restored!")
else:
    print("Could not find string replace target.")
    # let's write a python script to find the index of "SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")"
    idx = content.find('SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")')
    if idx != -1:
        start_idx = content.rfind('<div className="px-4 py-3 border-b', 0, idx)
        if start_idx != -1:
            # We replace from start_idx to idx - 110 (which is before the comment)
            # Actually, let's just do a manual replace
            before = content[:start_idx]
            after = content[idx-85:]
            content = before + new_content.replace('      SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")', '') + after
            with open("src/App.tsx", "w") as f:
                f.write(content)
            print("Chat Area restored via manual index!")
