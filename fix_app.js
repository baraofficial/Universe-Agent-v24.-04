const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add reply button to context menu, removing swipe to reply idea (user requested to add arrow icon in pop up instead of swiping left).
// Actually, user said: "Dibagian pop up di room chat tambahkan ikon panah untuk balas pesan user lain atau pesan dirinya sendiri dan untuk geser pesan kek kiri  user lain atau pesan sendiri itu dihapus aja ."

// Replace context menu contents
const contextMenuTarget = `            <div className="p-2 flex justify-around">
              <button 
                onClick={() => handleRoomMessageAction('delete')}
                className="flex-1 flex flex-col items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-xs font-medium">Hapus</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('star')}
                className={\`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer \${selectedRoomMessage.star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:bg-white/5'}\`}
              >
                <Star className={\`w-5 h-5 \${selectedRoomMessage.star ? 'fill-current' : ''}\`} />
                <span className="text-xs font-medium">Bintang</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('pin')}
                className={\`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer \${selectedRoomMessage.pin ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:bg-white/5'}\`}
              >
                <Pin className={\`w-5 h-5 \${selectedRoomMessage.pin ? 'fill-current' : ''}\`} />
                <span className="text-xs font-medium">Sematkan</span>
              </button>
            </div>`;

const contextMenuRepl = `            <div className="p-2 flex flex-wrap justify-around">
              <button 
                onClick={() => {
                  setReplyingTo(selectedRoomMessage);
                  setSelectedRoomMessage(null);
                }}
                className="flex-[0_0_25%] flex flex-col items-center gap-2 p-3 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Reply className="w-5 h-5" />
                <span className="text-xs font-medium">Balas</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('delete')}
                className="flex-[0_0_25%] flex flex-col items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-xs font-medium">Hapus</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('star')}
                className={\`flex-[0_0_25%] flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer \${selectedRoomMessage.star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:bg-white/5'}\`}
              >
                <Star className={\`w-5 h-5 \${selectedRoomMessage.star ? 'fill-current' : ''}\`} />
                <span className="text-xs font-medium">Bintang</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('pin')}
                className={\`flex-[0_0_25%] flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer \${selectedRoomMessage.pin ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:bg-white/5'}\`}
              >
                <Pin className={\`w-5 h-5 \${selectedRoomMessage.pin ? 'fill-current' : ''}\`} />
                <span className="text-xs font-medium">Sematkan</span>
              </button>
            </div>`;

content = content.replace(contextMenuTarget, contextMenuRepl);

// 2. Remove swipe to reply feature. 
// Let's check where the swipe logic is. 
// "geser pesan kek kiri  user lain atau pesan sendiri itu dihapus aja" - there might not be a swipe logic currently, maybe they mean clicking on it or something else? Wait, if they meant swipe... let me look for drag or framer-motion drag.
