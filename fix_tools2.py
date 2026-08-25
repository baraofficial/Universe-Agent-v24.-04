import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

old_db = """  {
    id: 'Database',
    name: 'Database',
    icon: DatabaseIcon,
    description: 'Menyimpan data produk, user, dan chat. Bisa search dan update.',
    keywords: ['db', 'database', 'simpan', 'data', 'search', 'update']
  }
] as const;"""

new_db = """  {
    id: 'Database',
    name: 'Database',
    icon: DatabaseIcon,
    description: 'Menyimpan data produk, user, dan chat. Bisa search dan update.',
    keywords: ['db', 'database', 'simpan', 'data', 'search', 'update']
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
] as const;"""

code = code.replace(old_db, new_db)

code = re.sub(r'\d+ Tools Siap', '11 Tools Siap', code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Tools added correctly")
