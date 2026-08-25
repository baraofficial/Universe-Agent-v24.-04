import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add Rocket to lucide-react imports
code = code.replace("ArrowDown} from 'lucide-react';", "ArrowDown, Rocket} from 'lucide-react';")

old_multimodal = """  {
    id: 'Multimodal',
    name: 'Multimodal',
    icon: ImageIcon,
    description: 'Menganalisis dan memproses gambar serta input multimodal lainnya',
    keywords: ['gambar', 'image', 'multimodal', 'foto', 'lihat', 'analisis', 'visual']
  }
] as const;"""

new_multimodal = """  {
    id: 'Multimodal',
    name: 'Multimodal',
    icon: ImageIcon,
    description: 'Menganalisis dan memproses gambar serta input multimodal lainnya',
    keywords: ['gambar', 'image', 'multimodal', 'foto', 'lihat', 'analisis', 'visual']
  },
  {
    id: 'Deploy Tools',
    name: 'Deploy Tools',
    icon: Rocket,
    description: 'Mendeploy aplikasi dan tools ke server atau cloud',
    keywords: ['deploy', 'publish', 'upload', 'server', 'hosting', 'cloud']
  }
] as const;"""

code = code.replace(old_multimodal, new_multimodal)

code = re.sub(r'\d+ Tools Siap', '12 Tools Siap', code)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Deploy tool added")
