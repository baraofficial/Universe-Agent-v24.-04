import type { VercelRequest, VercelResponse } from '@vercel/node';
import { commitFileToGithub } from '../../src/tools/github.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { path: filePath, content, message, owner, repo, branch, token } = req.body || {};
    if (!content) {
      return res.status(400).json({ success: false, error: 'Konten kode website tidak boleh kosong.' });
    }

    const targetPath = (filePath || 'index.html').trim();
    const commitMessage = (message || `Update ${targetPath} via Bara AI Website Preview`).trim();
    
    const commitUrl = await commitFileToGithub(targetPath, content, commitMessage, {
      owner,
      repo,
      branch,
      token
    });

    return res.status(200).json({
      success: true,
      commitUrl,
      message: `Berhasil sinkronisasi file '${targetPath}' ke GitHub!`
    });
  } catch (err: any) {
    console.error('Error in /api/github/sync serverless:', err);
    return res.status(400).json({
      success: false,
      error: err.message || 'Gagal melakukan sinkronisasi ke GitHub.'
    });
  }
}
