import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { runGitAdd, runGitCommit, runGitPush } from "./src/tools/git.js";
import { commitFileToGithub } from "./src/tools/github.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  let ai: GoogleGenAI | null = null;

  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        const key = process.env.GEMINI_API_KEY;
        if (!key) {
          return res.json({
            responseText: "Maaf cak, API Key Gemini belum disetting di environment variables. Silakan tambahkan GEMINI_API_KEY di Settings > Secrets.",
            toolUsed: "Error",
            status: "Ditolak (No API Key)"
          });
        }
        ai = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });
      }

      const { prompt, history, systemPrompt } = req.body;
      const lowerPrompt = prompt.toLowerCase();

      // INTERCEPT TEST AGENT (SINGLE FILE VIA OCTOKIT)
      if (lowerPrompt.includes("test agent")) {
        try {
          const commitUrl = await commitFileToGithub(
            "TEST_AGENT.md", 
            "# TEST AGENT\n\nIni adalah file test buatan Bara Agent cak! Berhasil di-upload via Octokit API.", 
            "test: create TEST_AGENT.md via agent"
          );
          return res.json({
            responseText: `Berhasil cak! File TEST_AGENT.md udah di-commit ke GitHub via Octokit.\n\n[Cek File Commit Disini](${commitUrl})`,
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

      
      // Transform history for better context
      let chatContext = "";
      if (history && history.length > 0) {
        chatContext = history.slice(-6).map((msg: any) => 
          `${msg.sender === 'user' ? 'User' : 'Agent'}: ${msg.text}`
        ).join('\n\n');
      }

      const finalSystemInstruction = `KAMU HARUS MEMATUHI INSTRUKSI SYSTEM INI DENGAN KETAT DAN TANPA TERKECUALI:

<system_prompt_dari_user>
${systemPrompt || "Kamu adalah BARA AGENT. Jawab dengan santai, gunakan kata sapaan 'cak'."}
</system_prompt_dari_user>

ATURAN WAJIB SISTEM KELUARAN (TIDAK BOLEH DILANGGAR):
1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan.
2. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property 'gitAction' di JSON dengan 'commitMessage' yang mendeskripsikan perubahan tersebut.
3. Selalu patuhi identitas, gaya bahasa, aturan, dan larangan yang ditetapkan dalam <system_prompt_dari_user> di atas.`;

  const promptWithContext = `Konteks percakapan sebelumnya:\n${chatContext}\n\nPertanyaan/Perintah User saat ini:\n${prompt}`;

      let response;
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: promptWithContext,
            config: {
              systemInstruction: finalSystemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  responseText: {
                      type: Type.STRING,
                      description: "Jawaban dari agent. Jika menyertakan sumber referensi, gunakan format markdown link [Nama Sumber](URL). Ingat jika ada sumber wajib dibuat jadi Markdown link."
                    },
                  toolUsed: {
                      type: Type.STRING,
                      description: "Tool yang relevan (Browser, Kalkulator, Catatan, Umum, dsb.)"
                    },
                  status: {
                      type: Type.STRING,
                      description: "Status eksekusi (Selesai, Ditolak (Ilegal), dll)"
                    },
                  gitAction: {
                     type: Type.OBJECT,
                     description: "Jika user meminta untuk melakukan commit dan push ke github, isi object ini.",
                     properties: {
                        commitMessage: { type: Type.STRING, description: "Pesan commit yang sesuai dengan permintaan" }
                     },
                     required: ["commitMessage"]
                  }
                },
                required: ["responseText", "toolUsed", "status"]
              }
            }
          });
          break; // success
        } catch (error: any) {
          if (error?.status === 503 || error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE")) {
            retries--;
            if (retries === 0) throw error;
            console.log(`Gemini API 503 error, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2;
          } else {
            throw error;
          }
        }
      }
      const outputStr = response?.text || "{}";
      const output = JSON.parse(outputStr);
      
      if (output.gitAction && output.gitAction.commitMessage) {
        try {
          if (process.env.VERCEL || process.env.VERCEL_ENV) {
            output.responseText += "\n\n[Info Serverless] Saat ini agent berjalan di server cloud (Vercel). Fitur local 'git add & push' tidak dapat dijalankan di environment ini. Silakan gunakan perintah 'test agent' untuk menguji Octokit (API GitHub).";
            output.toolUsed = "Deploy Tools";
            output.status = "Selesai (Serverless Mode)";
          } else {
            const token = process.env.GITHUB_TOKEN;
            await runGitAdd();
            await runGitCommit(output.gitAction.commitMessage);
            await runGitPush(token);
            output.responseText += "\n\nBerhasil cak! Kode udah di-commit dan di-push ke GitHub. [Link Commit](https://github.com/baraofficial/Universe-Agent-v24.-04/commits/main)";
            output.toolUsed = "Deploy Tools";
            output.status = "Selesai";
          }
        } catch (e: any) {
          console.error("Git error:", e);
          output.responseText += `

Gagal nge-push cak: ${e.message}`;
          output.toolUsed = "Error";
          output.status = "Gagal";
        }
      }
      
      res.json(output);
    } catch (error: any) {
      console.error("Gemini error:", error);
      res.json({
        responseText: `Waduh cak, ada error pas menghubungi Gemini: ${error.message}`,
        toolUsed: "Error",
        status: "Gagal"
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
