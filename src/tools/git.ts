import simpleGit, { SimpleGit } from 'simple-git';

const git: SimpleGit = simpleGit();

export const runGitAdd = async () => {
  console.log('Running git add...');
  await git.add('./*');
  return 'Files added successfully';
};

export const runGitCommit = async (message: string) => {
  console.log('Running git commit...');
  await git.commit(message);
  return `Committed with message: ${message}`;
};

export const runGitPush = async (token?: string) => {
  console.log('Running git push...');
  
  // Jika ada token dari ENV, kita bisa set remote origin menggunakan token untuk autentikasi otomatis
  if (token) {
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
    await git.pull('origin', 'main', ['--no-rebase', '--no-edit']);
  } catch (e) {
    console.warn('Pull failed, attempting to proceed anyway:', e);
  }

  const pushResult = await git.push('origin', 'main');
  return pushResult;
};
