const fs = require('fs');

// App.tsx replacements
let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/Gaya bahasa: Santai, panggil user 'cak'\./g, "Gaya bahasa: Keren dan profesional.");
app = app.replace(/Halo cak!/g, "Halo!");
app = app.replace(/Durasi video maksimal 20 detik cak!/g, "Durasi video maksimal 20 detik!");
app = app.replace(/memberikan jawaban bersahabat "cak"/g, 'memberikan jawaban keren');
app = app.replace(/Maaf cak, /g, "Maaf, ");
app = app.replace(/Waduh cak, /g, "Waduh, ");
app = app.replace(/dibersihkan cak!/g, "dibersihkan!");
fs.writeFileSync('src/App.tsx', app);

// server.ts replacements
let server = fs.readFileSync('server.ts', 'utf8');
server = server.replace(/Maaf cak, /g, "Maaf, ");
server = server.replace(/Bara AI cak! /g, "Bara AI! ");
server = server.replace(/Berhasil cak! /g, "Berhasil! ");
server = server.replace(/Gagal test agent cak: /g, "Gagal test agent: ");
server = server.replace(/gunakan kata sapaan 'cak'/g, "keren dan profesional");
server = server.replace(/Gagal nge-push cak: /g, "Gagal nge-push: ");
server = server.replace(/Waduh cak, /g, "Waduh, ");
fs.writeFileSync('server.ts', server);

