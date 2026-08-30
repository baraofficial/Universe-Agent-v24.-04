import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace("handleFirebaseGoogleLogout", "handleFirebaseLogout")
content = content.replace("googleUser.name", "googleUser.displayName")

with open("src/App.tsx", "w") as f:
    f.write(content)
