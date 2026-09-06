import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Try to remove any remaining firebase-related functions and effects
content = re.sub(r"  // --- STATE GOOGLE LOGIN \(FIREBASE\) ---\n  const \[googleUser, setGoogleUser\] = useState<any>\(null\);\n", "", content)
content = re.sub(r"  useEffect\(\(\) => \{\n    const unsubscribe = onAuthStateChanged\(auth, \(user\) => \{\n      setGoogleUser\(user\);\n    \}\);\n    return \(\) => unsubscribe\(\);\n  \}, \[\]\);\n", "", content)
content = re.sub(r"  const handleFirebaseGoogleLogin = async \(\) => \{.*?\n  \};\n", "", content, flags=re.DOTALL)
content = re.sub(r"  const handleFirebaseLogout = async \(\) => \{.*?\n  \};\n", "", content, flags=re.DOTALL)
content = re.sub(r"  // --- STATE GOOGLE LOGIN \(FIREBASE\) ---\n", "", content)

# Check for any lingering references
content = content.replace("googleUser?.displayName", "userName")
content = content.replace("googleUser?.photoURL", "false")
content = content.replace("googleUser.email", "''")

with open("src/App.tsx", "w") as f:
    f.write(content)
