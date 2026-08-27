import re

with open("src/main.tsx", "r") as f:
    content = f.read()

content = re.sub(r"import\s*\{\s*GoogleOAuthProvider\s*\}\s*from\s*'@react-oauth/google';\n", "", content)
content = content.replace("<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id'}>", "")
content = content.replace("</GoogleOAuthProvider>", "")

with open("src/main.tsx", "w") as f:
    f.write(content)
