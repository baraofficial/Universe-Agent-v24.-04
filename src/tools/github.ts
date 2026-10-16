import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

export interface GithubCommitOptions {
  token?: string;
  owner?: string;
  repo?: string;
  branch?: string;
}

export const commitFileToGithub = async (
  path: string, 
  content: string, 
  message: string,
  options?: GithubCommitOptions
) => {
  const token = options?.token?.trim() || process.env.GITHUB_TOKEN;
  if (!token || token === 'your_github_token_here') {
    throw new Error('Personal Access Token (PAT) GitHub diperlukan. Silakan masukkan token GitHub Anda.');
  }

  const octokit = new Octokit({ auth: token });
  const owner = options?.owner?.trim() || 'baraofficial';
  const repo = options?.repo?.trim() || 'Universe-Agent-v24.-04';
  const branch = options?.branch?.trim() || 'main';

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
