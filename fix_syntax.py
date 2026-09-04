import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Fix 1: leftover `}` from activeToolBadge around line 750
# The bad part looks like:
# <div className="flex items-center gap-2">
# 
# </div>
# }
# {/* 
# -----------------------------------------------------------------
# SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")
content = re.sub(r'</div>\s*\}\s*\{\/\*\s*-*\s*SIMULASI AGENT BERPIKIR', r'</div>\n      {/* \n      -----------------------------------------------------------------\n      SIMULASI AGENT BERPIKIR', content)


# Fix 2: leftover `)}` from `activeTab === 'chat' && (`
# </section>
# )}
# 
# {/* SIDEBAR TABS */}
content = re.sub(r'</section>\s*\)\}\s*\{\/\* SIDEBAR TABS \*\/?\}?', r'</section>', content)


# Fix 3: leftover from bottom nav
#       )}
# 
#       }
#  </div>
#  </nav>
#  </div>
#  );
# }
content = re.sub(r'\s*\}\s*</div>\s*</nav>\s*', r'\n', content)

with open("src/App.tsx", "w") as f:
    f.write(content)

