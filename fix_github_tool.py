import os

github_ts = """import { Octokit } from '@octokit/rest';
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
"""
with open('src/tools/github.ts', 'w') as f:
    f.write(github_ts)

with open('server.ts', 'r') as f:
    code = f.read()

import_str = 'import { runGitAdd, runGitCommit, runGitPush } from "./src/tools/git.js";'
new_import_str = import_str + '\nimport { commitFileToGithub } from "./src/tools/github.js";'
code = code.replace(import_str, new_import_str)

intercept_str = """      // INTERCEPT UNTUK GITHUB PUSH"""
new_intercept_str = """      // INTERCEPT TEST AGENT (SINGLE FILE VIA OCTOKIT)
      if (lowerPrompt.includes("test agent")) {
        try {
          const commitUrl = await commitFileToGithub(
            "TEST_AGENT.md", 
            "# TEST AGENT\\n\\nIni adalah file test buatan Bara Agent cak! Berhasil di-upload via Octokit API.", 
            "test: create TEST_AGENT.md via agent"
          );
          return res.json({
            responseText: `Berhasil cak! File TEST_AGENT.md udah di-commit ke GitHub via Octokit.\\n\\n[Cek File Commit Disini](${commitUrl})`,
            toolUsed: "Deploy Tools",
            status: "Selesai"
          });
        } catch (e: any) {
          console.error("Test agent error:", e);
          return res.json({
            responseText: `Gagal test agent cak: ${e.message}`,
            toolUsed: "Error",
            status: "Gagal"
          });
        }
      }

      // INTERCEPT UNTUK GITHUB PUSH"""
code = code.replace(intercept_str, new_intercept_str)

with open('server.ts', 'w') as f:
    f.write(code)

print("Tool created and server.ts patched")
