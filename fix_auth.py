import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace the old google auth state and handlers
old_auth_code = """  // --- STATE GOOGLE LOGIN ---
  const [googleUser, setGoogleUser] = useState<any>(() => {
    const saved = localStorage.getItem('bara_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      setGoogleUser(decoded);
      localStorage.setItem('bara_google_user', JSON.stringify(decoded));
      setMessages(prev => [...prev, {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `Login berhasil cak! Selamat datang ${(decoded as any).name}.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        toolUsed: 'Sistem'
      }]);
    }
  };

  const handleGoogleLogout = () => {
    googleLogout();
    setGoogleUser(null);
    localStorage.removeItem('bara_google_user');
  };"""

new_auth_code = """  // --- STATE GOOGLE LOGIN (FIREBASE) ---
  const [googleUser, setGoogleUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setGoogleUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleFirebaseGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setMessages(prev => [...prev, {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `Login berhasil cak! Selamat datang ${user.displayName}.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        toolUsed: 'Sistem'
      }]);
    } catch (error: any) {
      console.error("Firebase Login Error:", error);
      alert("Gagal login: " + error.message);
    }
  };

  const handleFirebaseLogout = async () => {
    try {
      await signOut(auth);
      setGoogleUser(null);
    } catch (error: any) {
      console.error("Firebase Logout Error:", error);
    }
  };"""

if old_auth_code in content:
    content = content.replace(old_auth_code, new_auth_code)
    print("Replaced auth code successfully")
else:
    print("Old auth code not found, using regex...")
    # fallback with regex
    pattern = re.compile(r"// --- STATE GOOGLE LOGIN ---.*?const handleGoogleLogout = \(\) => \{.*?\};", re.DOTALL)
    content = pattern.sub(new_auth_code, content)

with open("src/App.tsx", "w") as f:
    f.write(content)
