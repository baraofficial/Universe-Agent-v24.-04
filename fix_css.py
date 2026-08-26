import re

with open('src/index.css', 'r') as f:
    css = f.read()

# Fix broken box-shadow syntax
css = css.replace("var(--primary-500), 0.4), 0 0 40px var(--primary-500), 0.15)", "var(--color-primary-500), 0 0 40px var(--color-primary-900)")
css = css.replace("var(--primary-500), 0.5)", "var(--color-primary-500)")
css = css.replace("var(--primary-500), 0.8), 0 0 20px var(--primary-500), 0.4)", "var(--color-primary-500), 0 0 20px var(--color-primary-900)")

css = css.replace("glow-primary-text {", "glow-primary-text {\n    text-shadow: 0 0 10px var(--color-primary-500), 0 0 20px var(--color-primary-900);\n")
# Clean up duplicate text-shadow rules inside glow-primary-text if any
css = re.sub(r'text-shadow: 0 0 10px var\(--primary-500\), 0\.8\), 0 0 20px var\(--primary-500\), 0\.4\);', '', css)

with open('src/index.css', 'w') as f:
    f.write(css)
