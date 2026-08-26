import re

with open('src/index.css', 'r') as f:
    css = f.read()

theme_css = """
@theme {
  --color-primary-50: var(--primary-50);
  --color-primary-100: var(--primary-100);
  --color-primary-200: var(--primary-200);
  --color-primary-300: var(--primary-300);
  --color-primary-400: var(--primary-400);
  --color-primary-500: var(--primary-500);
  --color-primary-600: var(--primary-600);
  --color-primary-700: var(--primary-700);
  --color-primary-800: var(--primary-800);
  --color-primary-900: var(--primary-900);
  --color-primary-950: var(--primary-950);
}

:root {
  --primary-50: #faf5ff;
  --primary-100: #f3e8ff;
  --primary-200: #e9d5ff;
  --primary-300: #d8b4fe;
  --primary-400: #c084fc;
  --primary-500: #a855f7;
  --primary-600: #9333ea;
  --primary-700: #7e22ce;
  --primary-800: #6b21a8;
  --primary-900: #581c87;
  --primary-950: #3b0764;
}

.theme-green {
  --primary-50: #f0fdf4;
  --primary-100: #dcfce7;
  --primary-200: #bbf7d0;
  --primary-300: #86efac;
  --primary-400: #4ade80;
  --primary-500: #22c55e;
  --primary-600: #16a34a;
  --primary-700: #15803d;
  --primary-800: #166534;
  --primary-900: #14532d;
  --primary-950: #052e16;
}

.theme-blue {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  --primary-950: #172554;
}
"""

css = css.replace('@layer utilities {', theme_css + '\n@layer utilities {')
css = css.replace('rgba(139, 92, 246,', 'var(--primary-500),') # roughly
css = css.replace('text-shadow: 0 0 10px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.4);', 'text-shadow: 0 0 10px var(--color-primary-500), 0 0 20px var(--color-primary-900);')
css = css.replace('#2D1B69', 'var(--primary-900)')
css = css.replace('#8B5CF6', 'var(--primary-500)')
css = css.replace('glow-purple', 'glow-primary')

with open('src/index.css', 'w') as f:
    f.write(css)

with open('src/App.tsx', 'r') as f:
    app_tsx = f.read()

# Replace all purple utility classes with primary
app_tsx = re.sub(r'purple', 'primary', app_tsx)

with open('src/App.tsx', 'w') as f:
    f.write(app_tsx)

print("Theme patched")
