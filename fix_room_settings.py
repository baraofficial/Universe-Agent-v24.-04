import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# 1. Replace gear icon for the room settings button
header_btn_target = """              <button 
                onClick={() => setIsRoomSettingsOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>"""

header_btn_replacement = """              <button 
                onClick={() => setIsRoomSettingsOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>"""

content = content.replace(header_btn_target, header_btn_replacement)

# 2. Fix wallpaper script
wallpaper_script_target = """  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };"""

wallpaper_script_replacement = """  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          if (video.duration > 21) { // 21 to give a 1s buffer for 20s videos
            alert("Durasi video maksimal 20 detik cak!");
            URL.revokeObjectURL(video.src);
            return;
          }
          setRoomWallpaperType(type);
          setRoomWallpaper(video.src); // Gunakan object URL agar ringan dan cepat
        }
        video.src = URL.createObjectURL(file);
      } else {
        setRoomWallpaperType(type);
        const imgUrl = URL.createObjectURL(file);
        setRoomWallpaper(imgUrl);
      }
    }
  };"""

content = content.replace(wallpaper_script_target, wallpaper_script_replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)

