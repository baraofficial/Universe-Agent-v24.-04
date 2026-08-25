import re

with open('src/tools/git.ts', 'r') as f:
    code = f.read()

code = code.replace("['--no-rebase']", "['--no-rebase', '--no-edit']")

with open('src/tools/git.ts', 'w') as f:
    f.write(code)
