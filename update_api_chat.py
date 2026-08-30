import re

with open("api/chat.ts", "r") as f:
    content = f.read()

if "output.gitAction" not in content:
    git_logic = """
  if (output.gitAction && output.gitAction.commitMessage) {
    try {
      if (process.env.VERCEL || process.env.VERCEL_ENV) {
        // Di Vercel (Serverless), tidak bisa pakai simple-git untuk modif lokal direktori
        output.responseText += "\\n\\n[Info Serverless] Saat ini agent berjalan di server cloud (Vercel). Fitur local 'git add & push' tidak dapat memodifikasi repositori cloud secara langsung dari chat ini, namun integrasi GitHub API tetap berjalan normal.";
        output.toolUsed = "Deploy Tools";
        output.status = "Selesai (Serverless Mode)";
      } else {
        // Fallback untuk local Express (jika api/chat.ts dipanggil lokal)
        const { runGitAdd, runGitCommit, runGitPush } = await import('../src/tools/git.js');
        const token = process.env.GITHUB_TOKEN;
        await runGitAdd();
        await runGitCommit(output.gitAction.commitMessage);
        await runGitPush(token);
        output.responseText += "\\n\\nBerhasil cak! Kode udah di-commit dan di-push ke GitHub. [Link Commit](https://github.com/baraofficial/Universe-Agent-v24.-04/commits/main)";
        output.toolUsed = "Deploy Tools";
        output.status = "Selesai";
      }
    } catch (e: any) {
      console.error("Git error:", e);
      output.responseText += `\\nGagal nge-push cak: ${e.message}`;
      output.toolUsed = "Error";
      output.status = "Gagal";
    }
  }
"""
    content = content.replace("res.json(output);", git_logic + "\n  res.json(output);")
    
    with open("api/chat.ts", "w") as f:
        f.write(content)
    print("api/chat.ts updated")
