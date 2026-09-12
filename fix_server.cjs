const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace("app.use(express.json());", "app.use(express.json({ limit: '50mb' }));\n  app.use(express.urlencoded({ limit: '50mb', extended: true }));");
fs.writeFileSync('server.ts', content);
