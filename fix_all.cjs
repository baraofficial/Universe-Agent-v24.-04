const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Fix Layout (min-h-screen -> h-screen overflow-hidden)
content = content.replace(
  /<div className=\{\`min-h-screen bg-\[\#0A0A0A\] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-\$\{theme\}\`\}>/,
  `<div className={\`h-screen overflow-hidden bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-\${theme}\`}>`
);

// 2. Add userAvatar state and update Copy logic
const stateInsertionPoint = /const \[userName, setUserName\] = useState<string>\(\(\) => \{\n\s*return localStorage.getItem\('bara_username'\) \|\| '';\n\s*\}\);/;
const stateAddition = `const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('bara_username') || '';
  });
  const [userAvatar, setUserAvatar] = useState<string | null>(() => {
    return localStorage.getItem('bara_user_avatar') || null;
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [copiedAiMessageId, setCopiedAiMessageId] = useState<string | null>(null);`;
content = content.replace(stateInsertionPoint, stateAddition);

// Avatar input handler
const handlersInsertionPoint = /const handleClearChat = \(\) => \{/;
const handlersAddition = `const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUserAvatar(dataUrl);
        localStorage.setItem('bara_user_avatar', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
const handleClearChat = () => {`;
content = content.replace(handlersInsertionPoint, handlersAddition);

// Fix handleCopy for AI messages
const copyHandlerRegex = /const handleCopy = \(text: string\) => \{\n\s*navigator\.clipboard\.writeText\(text\);\n\s*\};/;
const copyHandlerReplacement = `const handleCopyAiMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAiMessageId(id);
    setTimeout(() => setCopiedAiMessageId(null), 2000);
  };`;
content = content.replace(copyHandlerRegex, copyHandlerReplacement);

// Update copy button in AI message
content = content.replace(
  /onClick=\{\(\) => handleCopy\(msg\.text\)\}/g,
  `onClick={() => handleCopyAiMessage(msg.id, msg.text)}`
);
content = content.replace(
  /<Copy className="w-4 h-4" \/>\n\s*<\/button>/g,
  `{copiedAiMessageId === msg.id ? <CheckIcon className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                 </button>`
);


// 3. Move "Pesan Berbintang" and add "Foto Profil" in Settings Modal
// First, remove Pesan Berbintang from its current position
const removePesanBerbintangRegex = /\{\/\* Pesan Berbintang \*\/\}\n\s*<div className="flex flex-col gap-3">\n\s*<button[\s\S]*?<\/button>\n\s*<\/div>\n\s*\{\/\* Edit Username \*\/\}/;
content = content.replace(removePesanBerbintangRegex, `{/* Edit Username */}`);

// Add Avatar Upload to Settings and insert Pesan Berbintang below System Prompt
const settingsSystemPromptRegex = /<div className="flex justify-end">\n\s*<button onClick=\{\(\) => \{\n\s*localStorage\.setItem\('bara_system_prompt', systemPrompt\);\n\s*setIsPromptSavedToast\(true\);\n\s*setTimeout\(\(\) => setIsPromptSavedToast\(false\), 3000\);\n\s*\}\} className="text-xs bg-primary-600 px-3 py-1\.5 rounded-lg text-white font-medium flex items-center gap-1 cursor-pointer">\n\s*<Save className="w-3 h-3" \/> Simpan Prompt\n\s*<\/button>\n\s*<\/div>\n\s*\{isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan<\/p>\}\n\s*<\/div>/;

const newSettingsReplacement = `<div className="flex justify-end">
                   <button onClick={() => {
                     localStorage.setItem('bara_system_prompt', systemPrompt);
                     setIsPromptSavedToast(true);
                     setTimeout(() => setIsPromptSavedToast(false), 3000);
                   }} className="text-xs bg-primary-600 px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1 cursor-pointer">
                     <Save className="w-3 h-3" /> Simpan Prompt
                   </button>
                </div>
                {isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan</p>}
              </div>

              {/* Pesan Berbintang */}
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsSettingsMenuOpen(false);
                    setIsStarredSessionsOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-primary-900/10 border border-primary-500/30 hover:bg-primary-900/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-200">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                    Pesan Berbintang
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>`;
content = content.replace(settingsSystemPromptRegex, newSettingsReplacement);

// Add Foto Profil above Edit Username
const editUsernameRegex = /\{\/\* Edit Username \*\/\}/;
const profilePicHTML = `{/* Foto Profil */}
              <div className="flex flex-col gap-3 items-center">
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <div className="w-20 h-20 rounded-full bg-primary-900/30 border-2 border-primary-500/50 flex items-center justify-center overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-10 h-10 text-primary-500/50" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input type="file" ref={avatarInputRef} accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>
                <h3 className="text-xs font-mono text-primary-400">Ubah Foto Profil</h3>
              </div>
              
              {/* Edit Username */}`;
content = content.replace(editUsernameRegex, profilePicHTML);

// 4. Update all <UserCircle className="w-6 h-6 text-primary-500/50" /> (except the new one) to show avatar if available
content = content.replace(
  /<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-\[\#1A1A24\] border border-primary-900\/50 flex items-center justify-center overflow-hidden">\n\s*<UserCircle className="w-6 h-6 text-primary-500\/50" \/>\n\s*<\/div>/g,
  `<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               {userAvatar ? (
                 <img src={userAvatar} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <UserCircle className="w-6 h-6 text-primary-500/50" />
               )}
             </div>`
);

fs.writeFileSync('src/App.tsx', content);
