const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Sidebar menu item Logo
const botMenuRegex = /<Bot className="w-5 h-5 text-primary-400" \/>/g;
content = content.replace(botMenuRegex, '<img src="https://i.ibb.co/ynkrwj54/Dr-Watermark-1789391792799-1.jpg" alt="Bara AI" className="w-5 h-5 rounded-md object-cover" />');

// Chat bubble Logo
const botAvatarRegex = /<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-950 border border-primary-400\/60 flex items-center justify-center\s*">\s*<Bot className="w-5 h-5 text-primary-200" \/>\s*<\/div>/g;
content = content.replace(botAvatarRegex, '<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-primary-400/60 flex items-center justify-center overflow-hidden"><img src="https://i.ibb.co/ynkrwj54/Dr-Watermark-1789391792799-1.jpg" alt="Bara AI" className="w-full h-full object-cover" /></div>');

fs.writeFileSync('src/App.tsx', content);
