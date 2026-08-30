import re

with open("src/App.tsx", "r") as f:
    content = f.read()

start_idx = content.find("const CodeBlock = ({ content }")
app_idx = content.find("export default function App")

# Let's import SyntaxHighlighter if not present
if "Prism as SyntaxHighlighter" not in content:
    import_str = """import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
"""
    content = content.replace("import React, { useState, useEffect, useRef } from 'react';", import_str + "import React, { useState, useEffect, useRef } from 'react';")
    # need to update indices after insertion
    start_idx = content.find("const CodeBlock = ({ content }")
    app_idx = content.find("export default function App")

replacement = """const CodeBlock = ({ content }: { content: string; key?: number | string }) => {
  const [copied, setCopied] = useState(false);
  
  // parse language and code
  const match = content.match(/```(\w*)\\n([\\s\\S]*?)```/);
  let language = match && match[1] ? match[1] : 'text';
  const code = (match ? match[2] : content.replace(/```/g, '')).trim();
  
  // Determine if this is a prompt
  const isPrompt = language.toLowerCase() === 'prompt' || (language.toLowerCase() === 'text' && code.toLowerCase().includes('prompt:'));
  if (isPrompt) language = 'prompt';
  const title = isPrompt ? 'PROMPT' : `${language.toUpperCase()} CODE`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-primary-500/40 bg-[#0A0A0C] overflow-hidden w-full max-w-full shadow-lg">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416]/90 border-b border-primary-500/30">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-primary-300 tracking-wider font-semibold uppercase">{title}</span>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 text-primary-300 transition-colors text-[10px] sm:text-xs font-mono font-medium cursor-pointer"
          >
            {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'COPIED' : 'COPY CODE'}
          </button>
        </div>
      </div>
      <div className="text-[13px] sm:text-sm font-mono leading-relaxed overflow-x-auto text-left">
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
