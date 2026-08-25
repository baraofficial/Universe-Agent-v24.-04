import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

ref_insertion = """  const handleClearTaskHistory = () => {
    setTaskHistory([]);
    localStorage.removeItem(STORAGE_KEY_TASKS);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    setIsAttachmentMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSendCommand(`Tolong proses file ini cak: ${file.name}`);
      // Reset input
      e.target.value = '';
    }
  };

  // ============================================================================
  // RENDER UI UTAMA APLIKASI
  // ============================================================================
  return ("""

code = code.replace("""  const handleClearTaskHistory = () => {
    setTaskHistory([]);
    localStorage.removeItem(STORAGE_KEY_TASKS);
  };

  // ============================================================================
  // RENDER UI UTAMA APLIKASI
  // ============================================================================
  return (""", ref_insertion)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Ref fixed")
