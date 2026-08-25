import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

export const commitFileToGithub = async (path: string, content: string, message: string) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN tidak ditemukan di env.');
  }

  const octokit = new Octokit({ auth: token });
  const owner = 'baraofficial';
  const repo = 'Universe-Agent-v24.-04';
  const branch = 'main';

  try {
    // Cek apakah file sudah ada untuk dapet SHA (wajib buat update)
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });
      if (!Array.isArray(data) && data.type === 'file') {
        sha = data.sha;
      }
    } catch (e: any) {
      if (e.status !== 404) {
        throw e;
      }
    }

    // Bikin atau update file
    const response = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString('base64'),
      sha,
      branch,
    });

    return response.data.commit.html_url;
  } catch (error) {
    console.error('Error committing file:', error);
    throw error;
  }
};
