import re

with open("src/App.tsx", "r") as f:
    content = f.read()

replacement = """const CodeBlock = ({ content }: { content: string; key?: number | string }) => {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);
  
  // parse language and code
  const match = content.match(/```(\\w*)\\n([\\s\\S]*?)```/);
  let language = match && match[1] ? match[1] : 'code';
  const code = match ? match[2] : content.replace(/```/g, '');
  
  // Determine if this is a prompt
  const isPrompt = language.toLowerCase() === 'prompt' || (language.toLowerCase() === 'text' && code.toLowerCase().includes('prompt:'));
  if (isPrompt) language = 'prompt';
  const typeText = isPrompt ? 'Prompt' : 'Code';
  const title = isPrompt ? 'PROMPT' : (language || 'text');

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-primary-500/40 bg-[#0A0A0C] overflow-hidden w-full max-w-full">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416]/90 border-b border-primary-500/30">
        <div className="flex items-center gap-2">
          {isPrompt ? <MessageSquare className="w-4 h-4 text-primary-400" /> : <FileCode className="w-4 h-4 text-primary-400" />}
          <span className="text-xs font-mono text-primary-300 uppercase tracking-wider">{title}</span>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setShowFull(!showFull)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-xs font-medium cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            {showFull ? 'Tutup' : `Lihat ${typeText}`}
          </button>
          <button 
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-xs font-medium cursor-pointer"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Tersalin' : `Salin ${typeText}`}
          </button>
        </div>
      </div>
      <div className={`p-4 overflow-x-auto text-[13px] sm:text-sm font-mono text-gray-300 leading-relaxed ${showFull ? '' : 'max-h-64'}`}>
        <pre className="whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};"""

# We'll use re.sub with regex to replace the function definition
pattern = re.compile(r'const CodeBlock = \(\{(.*?)\n\};\n', re.MULTILINE | re.DOTALL)
content = pattern.sub(replacement + '\n', content)

with open("src/App.tsx", "w") as f:
    f.write(content)
print("CodeBlock updated successfully")
