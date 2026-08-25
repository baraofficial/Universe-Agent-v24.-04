import re

with open('src/App.tsx', 'r') as f:
    code = f.read()

# Add storage key
code = code.replace("const STORAGE_KEY_NOTES = 'bara_agent_saved_notes';", "const STORAGE_KEY_NOTES = 'bara_agent_saved_notes';\nconst STORAGE_KEY_USERNAME = 'bara_agent_username';")

# Add Edit2 or Pencil icon to imports
code = code.replace("ArrowDown, Rocket} from 'lucide-react';", "ArrowDown, Rocket, Edit2, Check as CheckIcon} from 'lucide-react';")

# Add userName and isEditingUserName states
state_insertion = """  const [systemPrompt, setSystemPrompt] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROMPT);
    return saved || DEFAULT_SYSTEM_PROMPT;
  });
  const [isPromptSavedToast, setIsPromptSavedToast] = useState<boolean>(false);

  // --- STATE USERNAME ---
  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERNAME);
    return saved || 'Cak Bara';
  });
  const [isEditingUserName, setIsEditingUserName] = useState<boolean>(false);
  const [tempUserName, setTempUserName] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERNAME, userName);
  }, [userName]);"""
code = code.replace("""  const [systemPrompt, setSystemPrompt] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROMPT);
    return saved || DEFAULT_SYSTEM_PROMPT;
  });
  const [isPromptSavedToast, setIsPromptSavedToast] = useState<boolean>(false);""", state_insertion)

# Replace the hardcoded username in the Account tab
old_account = """              <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">
                    <User className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Username</p>
                    <p className="text-sm font-bold text-gray-200">Cak Bara</p>
                  </div>
                </div>
              </div>"""

new_account = """              <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg shrink-0">
                    <User className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Username</p>
                    {isEditingUserName ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempUserName}
                          onChange={(e) => setTempUserName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setUserName(tempUserName || 'Cak Bara');
                              setIsEditingUserName(false);
                            }
                          }}
                          autoFocus
                          className="w-full bg-[#0A0A0E] border border-purple-500/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 text-sm text-gray-100"
                        />
                        <button
                          onClick={() => {
                            setUserName(tempUserName || 'Cak Bara');
                            setIsEditingUserName(false);
                          }}
                          className="p-1 rounded bg-purple-600/50 hover:bg-purple-500 text-white transition-all cursor-pointer"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-gray-200">{userName}</p>
                        <button
                          onClick={() => {
                            setTempUserName(userName);
                            setIsEditingUserName(true);
                          }}
                          className="text-gray-500 hover:text-purple-300 transition-colors p-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>"""

code = code.replace(old_account, new_account)

with open('src/App.tsx', 'w') as f:
    f.write(code)

print("Username made editable")
