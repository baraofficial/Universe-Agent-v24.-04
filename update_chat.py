import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Update ChatMessage Interface to include feedback
interface_target = """export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  toolUsed?: string;
}"""

interface_replacement = """export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  toolUsed?: string;
  feedback?: 'up' | 'down';
}"""
content = content.replace(interface_target, interface_replacement)

# 2. Add handleFeedback and handleCopy
functions_target = """  const [messages, setMessages] = useState<ChatMessage[]>(() => {"""
functions_replacement = """  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, feedback: msg.feedback === type ? undefined : type } : msg
    ));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => {"""
if "handleFeedback" not in content:
    content = content.replace(functions_target, functions_replacement)

# 3. Remove Terminal Header
header_target = """ <div className="px-4 py-3 border-b border-primary-900/30 bg-[#120D22]/60 flex items-center justify-between">
   <div className="flex items-center gap-2">
     <h2 className="text-sm font-semibold text-primary-300 font-orbitron">Bara AI Terminal</h2>
   </div>
 </div>"""
content = content.replace(header_target, "")

# 4. Update Tool Badge to Icons
tool_badge_target = """             {isAi && msg.toolUsed && (
               <div className="mt-3 pt-3 border-t border-primary-900/30 flex items-center justify-between">
                 <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-900/20 border border-primary-900/30 text-[10px] font-mono text-primary-400">
                   <Wrench className="w-3 h-3" />
                   <span>Tool: {msg.toolUsed}</span>
                 </div>
               </div>
             )}"""
tool_badge_replacement = """             {isAi && (
               <div className="mt-3 pt-3 flex items-center gap-2">
                 <button 
                   onClick={() => handleCopy(msg.text)}
                   className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
                   title="Salin Pesan"
                 >
                   <Copy className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleFeedback(msg.id, 'up')}
                   className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-gray-200'}`}
                   title="Bagus"
                 >
                   <ThumbsUp className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleFeedback(msg.id, 'down')}
                   className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                   title="Buruk"
                 >
                   <ThumbsDown className="w-4 h-4" />
                 </button>
               </div>
             )}"""
content = content.replace(tool_badge_target, tool_badge_replacement)

# 5. Remove Coba Perintah Header
pattern_coba = re.compile(r'\{\/\* Tombol Prompt Cepat untuk Uji Coba Langsung \*\/\}\s*<div className="flex items-center gap-2 mb-2\.5 overflow-x-auto pb-1">.*?</div>', re.DOTALL)
content = pattern_coba.sub('', content)

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Done updating!")
