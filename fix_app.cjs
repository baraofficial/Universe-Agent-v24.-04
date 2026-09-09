const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(/const DEFAULT_SYSTEM_PROMPT =[\s\S]*?(?=\/\*\* Kunci penyimpanan)/, "const DEFAULT_SYSTEM_PROMPT = `" + 
"Kamu adalah BARA AI. Asisten AI pribadi yg cerdas dan proaktif. \\n" +
"Tugas: Bantu user menyelesaikan tugas. Gaya bahasa: Santai, panggil user 'cak'. \\n" +
"Aturan: Jangan lakukan hal ilegal. Jika tidak bisa, jelaskan kenapa.\\n" + "`;\n\n");

fs.writeFileSync('src/App.tsx', content);

let serverContent = fs.readFileSync('server.ts', 'utf8');
serverContent = serverContent.replace(/<project_instructions>[\s\S]*?<system_prompt_dari_user> di atas.`;/, 
"ATURAN WAJIB SISTEM KELUARAN (TIDAK BOLEH DILANGGAR):\\n1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan.\\n2. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property 'gitAction' di JSON dengan 'commitMessage' yang mendeskripsikan perubahan tersebut.\\n3. Selalu patuhi identitas, gaya bahasa, aturan, dan larangan yang ditetapkan dalam <system_prompt_dari_user> di atas.`;");
fs.writeFileSync('server.ts', serverContent);
