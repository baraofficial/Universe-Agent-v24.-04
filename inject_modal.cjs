const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const deleteModalUI = `
      {/* Modal Hapus Obrolan Room Chat */}
      {isDeleteRoomChatModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsDeleteRoomChatModalOpen(false)}>
          <div className="bg-[#141416] border border-primary-500/30 rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
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
              <button onClick={() => setIsDeleteRoomChatModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-gray-200 cursor-pointer transition-colors">
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
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(/\{\/\* Starred Sessions Sidebar \(AI Chat\) \*\/\}/, deleteModalUI + "\n      {/* Starred Sessions Sidebar (AI Chat) */}");
fs.writeFileSync('src/App.tsx', content);
