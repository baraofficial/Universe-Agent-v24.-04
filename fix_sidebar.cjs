const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

const footerRegex = /<div className="mt-auto p-4 text-center border-t border-primary-900\/30">\s*<p className="text-xs text-gray-500 font-mono tracking-wider">\s*© Bara Official X Bara AI\s*<\/p>\s*<\/div>/m;
const newFooter = `<div className="mt-auto p-4 border-t border-primary-900/30 flex flex-col items-center gap-3">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Ikuti Kami</span>
                      <div className="flex items-center gap-4">
                        <a href="https://www.tiktok.com/@cakbagoes54" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary-900/30 flex items-center justify-center text-gray-300 hover:bg-primary-500/20 hover:text-white transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                        </a>
                        <a href="https://whatsapp.com/channel/0029ValiK1L2ZjCi3uWn9y1v" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary-900/30 flex items-center justify-center text-gray-300 hover:bg-green-500/20 hover:text-green-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </a>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-600 font-mono tracking-wider mt-1">
                      © Bara Official X Bara AI
                    </p>
                  </div>`;

content = content.replace(footerRegex, newFooter);
fs.writeFileSync('src/App.tsx', content);
