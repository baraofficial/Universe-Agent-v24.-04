import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Remove imports
content = re.sub(r"import \{ signInWithPopup, signOut, onAuthStateChanged \} from 'firebase/auth';\n", "", content)
content = re.sub(r"import \{ auth, googleProvider \} from './firebase';\n", "", content)

# Remove state and effects
firebase_state_pattern = re.compile(r"  // --- STATE GOOGLE LOGIN \(FIREBASE\) ---\n  const \[googleUser, setGoogleUser\] = useState<any>\(null\);\n\n  useEffect\(\(\) => \{\n    const unsubscribe = onAuthStateChanged\(auth, \(user\) => \{\n      if \(user\) \{\n        setGoogleUser\(user\);\n      \} else \{\n        setGoogleUser\(null\);\n      \}\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);\n\n  const handleFirebaseGoogleLogin = async \(\) => \{.*?\n  \};\n\n  const handleFirebaseLogout = async \(\) => \{.*?\n  \};\n", re.DOTALL)
content = firebase_state_pattern.sub("", content)

# Fallbacks if regex misses something
content = content.replace("googleUser?.displayName", "userName")
content = content.replace("googleUser?.photoURL", "false")
content = content.replace("googleUser.email", "''")

# Now update the settings modal where Firebase Login is
settings_login_pattern = re.compile(r'                <h3 className="text-xs font-mono text-primary-300 uppercase">Akun Google</h3>\s*\{googleUser \? \(.*?</button>\s*</div>\s*\)\}\s*</div>', re.DOTALL)

# Let's just find and replace the google section inside Settings
settings_target = """              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Akun Google</h3>
                {googleUser ? (
                  <div className="flex items-center justify-between p-3 bg-primary-900/10 border border-primary-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={googleUser.picture} alt="Profile" className="w-10 h-10 rounded-full border border-primary-500" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-semibold text-sm">{googleUser.displayName}</p>
                        <p className="text-xs text-gray-400">{googleUser.email}</p>
                      </div>
                    </div>
                    <button onClick={handleFirebaseLogout} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleFirebaseGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
                    Login dengan Google
                  </button>
                )}
              </div>"""

if settings_target in content:
    content = content.replace(settings_target, "")

with open("src/App.tsx", "w") as f:
    f.write(content)

print("Firebase removed from App.tsx")
