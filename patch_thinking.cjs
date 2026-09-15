const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the Sparkles icon with the downloaded image
const thinkingAvatarRegex = /<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-900\/60 border border-primary-400\/80 flex items-center justify-center animate-pulse">[\s\S]*?<Sparkles className="w-5 h-5 text-primary-300 animate-spin" style=\{\{ animationDuration: '3s' \}\} \/>[\s\S]*?<\/div>/;

const newThinkingAvatar = `<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#141416]/90 border border-primary-500/50 flex items-center justify-center overflow-hidden">
    <img src="/bara-ai-loading.png" alt="Thinking" className="w-6 h-6 object-cover animate-spin" style={{ animationDuration: '3s' }} />
  </div>`;

if (content.match(thinkingAvatarRegex)) {
    content = content.replace(thinkingAvatarRegex, newThinkingAvatar);
}

// Replace the AI bubble in the regular messages with the image too, if it exists
// First, find how the AI avatar is currently rendered in messages
const aiAvatarRegex = /\{msg\.sender === 'ai' \? \([\s\S]*?<Sparkles className="w-5 h-5 text-primary-300" \/>[\s\S]*?<\/div>\)/;
const newAiAvatar = `{msg.sender === 'ai' ? (
              <div className="flex-shrink-0 mt-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#141416]/90 border border-primary-500/50 flex items-center justify-center overflow-hidden">
                  <img src="/bara-ai-loading.png" alt="AI" className="w-6 h-6 object-cover" />
                </div>
              </div>
            )`;
if (content.match(aiAvatarRegex)) {
    content = content.replace(aiAvatarRegex, newAiAvatar);
}

fs.writeFileSync('src/App.tsx', content);
