import re

with open("src/App.tsx", "r") as f:
    content = f.read()

start_idx = content.find("const CodeBlock = ({ content }")
app_idx = content.find("export default function App")

replacement = """const CodeBlock = ({ content }: { content: string; key?: number | string }) => {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  
  // parse language and code
  const match = content.match(/```(\w*)\\n([\\s\\S]*?)```/);
  let language = match && match[1] ? match[1] : 'text';
  const code = (match ? match[2] : content.replace(/```/g, '')).trim();
  
  // Determine if this is a prompt
  const isPrompt = language.toLowerCase() === 'prompt' || (language.toLowerCase() === 'text' && code.toLowerCase().includes('prompt:'));
  if (isPrompt) language = 'prompt';
  const typeText = isPrompt ? 'Prompt' : 'Code';
  const title = isPrompt ? 'PROMPT' : language.toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-primary-500/40 bg-[#0A0A0C] overflow-hidden w-full max-w-full shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416]/90 border-b border-primary-500/30">
        <div className="flex items-center gap-2">
          {isPrompt ? <MessageSquare className="w-4 h-4 text-primary-400" /> : <FileCode className="w-4 h-4 text-primary-400" />}
          <span className="text-xs font-mono text-primary-300 tracking-wider font-semibold uppercase">{title}</span>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setShowFull(!showFull)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-[10px] sm:text-xs font-mono font-medium cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            {showFull ? 'Tutup' : `Lihat ${typeText}`}
          </button>
          <button 
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-[10px] sm:text-xs font-mono font-medium cursor-pointer"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : `Salin ${typeText}`}
          </button>
        </div>
      </div>
      <div className={`relative text-[13px] sm:text-sm font-mono leading-relaxed text-left ${showFull ? '' : 'max-h-64 overflow-hidden'}`}>
        <SyntaxHighlighter
          language={language.toLowerCase() === 'prompt' ? 'text' : language.toLowerCase()}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.25rem',
            background: '#0A0A0C',
            fontSize: 'inherit',
          }}
          wrapLongLines={false}
        >
          {code}
        </SyntaxHighlighter>
        {!showFull && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A0C] to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
};

"""

if start_idx != -1 and app_idx != -1:
    new_content = content[:start_idx] + replacement + content[app_idx:]
    with open("src/App.tsx", "w") as f:
        f.write(new_content)
    print("CodeBlock updated successfully")
else:
    print("Failed to find boundaries")
