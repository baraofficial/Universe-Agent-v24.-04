import re

with open('src/tools/git.ts', 'r') as f:
    code = f.read()

replacement = """  if (token) {
    try {
      const remotes = await git.getRemotes(true);
      const origin = remotes.find(r => r.name === 'origin');
      if (origin) {
        let url = origin.refs.push;
        if (url.startsWith('https://github.com/')) {
          url = url.replace('https://github.com/', `https://oauth2:${token}@github.com/`);
          await git.remote(['set-url', 'origin', url]);
        }
      }
      
      // Ensure local git has email/name configured to avoid commit/pull issues
      await git.addConfig('user.name', 'Bara Official');
      await git.addConfig('user.email', 'bagoesrahmatulloh@gmail.com');
    } catch (e) {
      console.error('Error setting remote auth:', e);
    }
  }

  // Try to pull latest changes to avoid conflicts (e.g. from Octokit commits)
  try {
    console.log('Pulling latest changes from remote...');
    await git.pull('origin', 'main', ['--no-rebase']);
  } catch (e) {
    console.warn('Pull failed, attempting to proceed anyway:', e);
  }

  const pushResult = await git.push('origin', 'main');"""

code = code.replace("""  if (token) {
    try {
      const remotes = await git.getRemotes(true);
      const origin = remotes.find(r => r.name === 'origin');
      if (origin) {
        let url = origin.refs.push;
        if (url.startsWith('https://github.com/')) {
          url = url.replace('https://github.com/', `https://oauth2:${token}@github.com/`);
          await git.remote(['set-url', 'origin', url]);
        }
      }
    } catch (e) {
      console.error('Error setting remote auth:', e);
    }
  }

  const pushResult = await git.push('origin', 'main');""", replacement)

with open('src/tools/git.ts', 'w') as f:
    f.write(code)

print("git.ts patched to pull before pushing")
