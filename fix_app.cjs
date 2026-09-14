const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add import for IndexedDB
if (!content.includes('saveWallpaper')) {
  content = content.replace(/import React, \{ useState, useEffect, useRef \} from 'react';/, "import React, { useState, useEffect, useRef } from 'react';\nimport { saveWallpaper, getWallpaper, deleteWallpaper } from './lib/indexedDB';");
}

// 2. Add state for the new modals
const newStates = `  const [isDeleteRoomChatModalOpen, setIsDeleteRoomChatModalOpen] = useState(false);
  const [deleteObrolanChecked, setDeleteObrolanChecked] = useState(true);
  const [deleteMediaChecked, setDeleteMediaChecked] = useState(false);
`;

content = content.replace(/const \[isRoomSettingsOpen, setIsRoomSettingsOpen\] = useState\(false\);/, newStates + "  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);");

// 3. Update useEffect to load wallpaper from IndexedDB on mount
const loadWallpaperCode = `  useEffect(() => {
    getWallpaper().then(res => {
      if (res) {
        setRoomWallpaper(res.dataUrl);
        setRoomWallpaperType(res.type as 'image' | 'video');
      }
    }).catch(console.error);
  }, []);
`;
content = content.replace(/const \[roomWallpaperType, setRoomWallpaperType\] = useState<'image' \| 'video' \| null>\(null\);/, "const [roomWallpaperType, setRoomWallpaperType] = useState<'image' | 'video' | null>(null);\n" + loadWallpaperCode);

// 4. Modify handleWallpaperChange to read file as Data URL instead of object URL so it can be saved to IDB
const handleWallpaperRegex = /const handleWallpaperChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\} else \{\s*setRoomWallpaperType\(type\);\s*const imgUrl = URL\.createObjectURL\(file\);\s*setRoomWallpaper\(imgUrl\);\s*\}\s*\}\s*\};/m;

const newHandleWallpaper = `const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        
        if (type === 'video') {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = async function() {
            if (video.duration > 21) {
              alert("Durasi video maksimal 20 detik!");
              return;
            }
            setRoomWallpaperType('video');
            setRoomWallpaper(dataUrl);
            await saveWallpaper(dataUrl, 'video');
          }
          video.src = dataUrl;
        } else {
          setRoomWallpaperType('image');
          setRoomWallpaper(dataUrl);
          await saveWallpaper(dataUrl, 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };`;

content = content.replace(handleWallpaperRegex, newHandleWallpaper);

// 5. Update delete wallpaper logic
content = content.replace(/onClick=\{\(\) => \{ setRoomWallpaper\(null\); setRoomWallpaperType\(null\); \}\}/, "onClick={() => { setRoomWallpaper(null); setRoomWallpaperType(null); deleteWallpaper().catch(console.error); }}");

// 6. Add "Hapus Obrolan" button in room settings below "Pesan Berbintang"
const roomSettingsDeleteBtn = `                  <button 
                    onClick={() => {
                      setIsRoomSettingsOpen(false);
                      setIsStarredMessagesOpen(true);
                    }}
                    className="w-full py-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer mb-3"
                  >
                    <Star className="w-5 h-5 fill-current" />
                    Pesan Berbintang
                  </button>
                  <button 
                    onClick={() => {
                      setIsRoomSettingsOpen(false);
                      setIsDeleteRoomChatModalOpen(true);
                    }}
                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                    Hapus
                  </button>`;
content = content.replace(/<button \s*onClick=\{\(\) => \{\s*setIsRoomSettingsOpen\(false\);\s*setIsStarredMessagesOpen\(true\);\s*\}\}\s*className="w-full py-3 rounded-xl border border-yellow-500\/30 text-yellow-400 hover:bg-yellow-500\/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"\s*>\s*<Star className="w-5 h-5 fill-current" \/>\s*Pesan Berbintang\s*<\/button>/m, roomSettingsDeleteBtn);

// 7. Add Delete Modal UI near end of file or within modales section
const deleteModalUI = `{/* Modal Hapus Obrolan Room Chat */}
      {isDeleteRoomChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#141416] border border-primary-500/30 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative">
            <div className="p-4 border-b border-primary-900/30 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-200">Hapus Pesan</h2>
              <button onClick={() => setIsDeleteRoomChatModalOpen(false)} className="text-gray-400 hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={\`w-5 h-5 rounded border flex items-center justify-center \${deleteObrolanChecked ? 'bg-primary-600 border-primary-600' : 'border-gray-500'}\`}>
                   {deleteObrolanChecked && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={deleteObrolanChecked} onChange={(e) => setDeleteObrolanChecked(e.target.checked)} />
                <span className="text-sm text-gray-300">Hapus obrolan (pesan teks)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={\`w-5 h-5 rounded border flex items-center justify-center \${deleteMediaChecked ? 'bg-primary-600 border-primary-600' : 'border-gray-500'}\`}>
                   {deleteMediaChecked && <CheckIcon className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={deleteMediaChecked} onChange={(e) => setDeleteMediaChecked(e.target.checked)} />
                <span className="text-sm text-gray-300">Hapus media (foto, video, dokumen)</span>
              </label>
            </div>
            <div className="p-4 border-t border-primary-900/30 flex justify-end gap-3">
              <button onClick={() => setIsDeleteRoomChatModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200">
                Batal
              </button>
              <button 
                onClick={() => {
                  if (deleteObrolanChecked && deleteMediaChecked) {
                    setRoomMessages([]);
                  } else if (deleteObrolanChecked) {
                    setRoomMessages(prev => prev.filter(m => m.file != null));
                  } else if (deleteMediaChecked) {
                    setRoomMessages(prev => prev.filter(m => m.file == null));
                  }
                  setIsDeleteRoomChatModalOpen(false);
                }}
                disabled={!deleteObrolanChecked && !deleteMediaChecked}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(/\{isStarredSessionsOpen && \(/, deleteModalUI + "      {isStarredSessionsOpen && (");

fs.writeFileSync('src/App.tsx', content);
