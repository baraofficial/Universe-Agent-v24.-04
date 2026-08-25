import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_tools = """  {
    id: 'Catatan',
    name: 'Catatan',
    icon: FileText,
    description: 'Mencatat, menyimpan, dan mengingatkan poin penting user',
    keywords: ['catat', 'ingat', 'catatan', 'simpan', 'tuliskan', 'ingatkan', 'note']
  }
];"""

new_tools = """  {
    id: 'Catatan',
    name: 'Catatan',
    icon: FileText,
    description: 'Mencatat, menyimpan, dan mengingatkan poin penting user',
    keywords: ['catat', 'ingat', 'catatan', 'simpan', 'tuliskan', 'ingatkan', 'note']
  },
  {
    id: 'Code Execution',
    name: 'Code Execution',
    icon: Terminal,
    description: 'Mengeksekusi kode program secara langsung dalam sandbox',
    keywords: ['code', 'eksekusi', 'jalankan', 'run', 'script', 'program', 'terminal']
  },
  {
    id: 'Function Calling',
    name: 'Function Calling',
    icon: Code,
    description: 'Memanggil fungsi API eksternal dan custom functions',
    keywords: ['fungsi', 'api', 'panggil', 'function', 'calling', 'eksternal']
  },
  {
    id: 'Multimodal',
    name: 'Multimodal',
    icon: ImageIcon,
    description: 'Menganalisis dan memproses gambar serta input multimodal lainnya',
    keywords: ['gambar', 'image', 'multimodal', 'foto', 'lihat', 'analisis', 'visual']
  }
];"""

code = code.replace(old_tools, new_tools)

# Also update "3 Tools Siap" to "6 Tools Siap"
code = code.replace("3 Tools Siap", "6 Tools Siap")
code = code.replace("List Tools: [Browser, Kalkulator, Catatan]", "List Tools: [Browser, Kalkulator, Catatan, Code Execution, Function Calling, Multimodal]")

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Tools added")
