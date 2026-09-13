const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Replace 'Cak Bara' with 'Bara' or 'User' (let's use 'User' or just 'Bara', default username, the prompt says "hapus kata cak" so "Bara")
content = content.replace(/return saved \|\| 'Cak Bara';/g, "return saved || 'Bara';");

// 2. Replace 'User (Cak)' with 'User'
content = content.replace(/\(userName \|\| 'User \(Cak\)'\)/g, "(userName || 'User')");
content = content.replace(/\(userName \|\| 'USER \(Cak\)'\)/g, "(userName || 'USER')");

// 3. Replace <Wrench ... /> with <Pencil ... />
content = content.replace(/<Wrench className="w-4 h-4" \/>/g, '<Pencil className="w-4 h-4" />');

fs.writeFileSync('src/App.tsx', content);
