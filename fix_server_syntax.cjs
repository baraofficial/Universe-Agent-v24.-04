const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The syntax error is caused by assigning raw text (without quotes or backticks) to finalSystemInstruction
// We need to restore it to the original working version or wrap it properly.
// The user injected a massive block of unquoted text starting at line 96: `const finalSystemInstruction = Mandatory analysis...`

// We will find this entire block and replace it with the original safe instruction.
const regex = /const finalSystemInstruction = Mandatory analysis[\s\S]*?ATURAN WAJIB SISTEM KELUARAN.*?`;/m;

const originalInstruction = `      const finalSystemInstruction = \`KAMU HARUS MEMATUHI INSTRUKSI SYSTEM INI DENGAN KETAT DAN TANPA TERKECUALI:

<system_prompt_dari_user>
\${systemPrompt || "Kamu adalah BARA AI. Jawab dengan santai, gunakan kata sapaan 'cak'."}
</system_prompt_dari_user>
ATURAN WAJIB SISTEM KELUARAN (TIDAK BOLEH DILANGGAR):\\n1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan.\\n2. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property 'gitAction' di JSON dengan 'commitMessage' yang mendeskripsikan perubahan tersebut.\\n3. Selalu patuhi identitas, gaya bahasa, aturan, dan larangan yang ditetapkan dalam <system_prompt_dari_user> di atas.\`;`;

content = content.replace(regex, originalInstruction);

fs.writeFileSync('server.ts', content);
