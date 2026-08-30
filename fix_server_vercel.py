import re

with open("server.ts", "r") as f:
    content = f.read()

target = """          const token = process.env.GITHUB_TOKEN;
          await runGitAdd();
          await runGitCommit(output.gitAction.commitMessage);
          await runGitPush(token);
          output.responseText += "\\n\\nBerhasil cak! Kode udah di-commit dan di-push ke GitHub. [Link Commit](https://github.com/baraofficial/Universe-Agent-v24.-04/commits/main)";
          output.toolUsed = "Deploy Tools";
          output.status = "Selesai";"""

replacement = """          if (process.env.VERCEL || process.env.VERCEL_ENV) {
            output.responseText += "\\n\\n[Info Serverless] Saat ini agent berjalan di server cloud (Vercel). Fitur local 'git add & push' tidak dapat dijalankan di environment ini. Silakan gunakan perintah 'test agent' untuk menguji Octokit (API GitHub).";
            output.toolUsed = "Deploy Tools";
            output.status = "Selesai (Serverless Mode)";
          } else {
            const token = process.env.GITHUB_TOKEN;
            await runGitAdd();
            await runGitCommit(output.gitAction.commitMessage);
            await runGitPush(token);
            output.responseText += "\\n\\nBerhasil cak! Kode udah di-commit dan di-push ke GitHub. [Link Commit](https://github.com/baraofficial/Universe-Agent-v24.-04/commits/main)";
            output.toolUsed = "Deploy Tools";
            output.status = "Selesai";
          }"""

if target in content:
    content = content.replace(target, replacement)
    with open("server.ts", "w") as f:
        f.write(content)
    print("server.ts updated")
else:
    print("Target not found in server.ts")
