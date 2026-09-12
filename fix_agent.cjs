const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const regex = /\$\{systemPrompt \|\| "Kamu adalah BARA AI\. Jawab dengan santai, gunakan kata sapaan 'cak'\."\}/g;
const replacement = `\${systemPrompt || "Kamu bukan lagi sekadar AI Agent, kamu adalah Bara, teman ngobrol yang asik. Jawab dengan santai, gunakan kata sapaan 'cak'."}`;

content = content.replace(regex, replacement);

fs.writeFileSync('server.ts', content);
