import re

with open("src/App.tsx", "r") as f:
    content = f.read()

target = """               {false ? (
                 <img src={googleUser.photoURL} alt="User" className="w-full h-full object-cover" />
               ) : (
                 <UserCircle className="w-6 h-6 text-primary-500/50" />
               )}"""
replacement = """               <UserCircle className="w-6 h-6 text-primary-500/50" />"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/App.tsx", "w") as f:
        f.write(content)
