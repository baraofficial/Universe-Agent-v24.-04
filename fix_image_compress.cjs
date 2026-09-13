const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{\s*const file = e\.target\.files\?\.\[0\];\s*if \(file\) \{\s*const reader = new FileReader\(\);\s*reader\.onload = \(event\) => \{\s*setSelectedFile\(\{\s*name: file\.name,\s*dataUrl: event\.target\?\.result as string,\s*type: file\.type\s*\}\);\s*\};\s*reader\.readAsDataURL\(file\);\s*\}\s*\};/;

const replacement = `const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const MAX_DIM = 800; // Compress image down to max 800px

            if (width > height) {
              if (width > MAX_DIM) {
                height *= MAX_DIM / width;
                width = MAX_DIM;
              }
            } else {
              if (height > MAX_DIM) {
                width *= MAX_DIM / height;
                height = MAX_DIM;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Convert to JPEG with 70% quality to dramatically reduce size
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            setSelectedFile({
              name: file.name,
              dataUrl: compressedDataUrl,
              type: 'image/jpeg'
            });
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setSelectedFile({
            name: file.name,
            dataUrl: event.target?.result as string,
            type: file.type
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/App.tsx', content);
