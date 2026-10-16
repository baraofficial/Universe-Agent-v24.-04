import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { runGitAdd, runGitCommit, runGitPush } from "./src/tools/git.js";
import { commitFileToGithub } from "./src/tools/github.js";

// Global process error handlers to ensure the server process never crashes unexpectedly
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception in server process:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: "*" },
    maxHttpBufferSize: 50 * 1024 * 1024 // 50MB for large image data
  });

  io.on("connection", (socket) => {
    console.log("User connected to room chat:", socket.id);
    
    // Broadcast incoming messages to all other clients
    socket.on("room_message", (data) => {
      // Send to everyone else
      socket.broadcast.emit("room_message", data);
    });

    socket.on("update_room_message", (data) => {
      socket.broadcast.emit("update_room_message", data);
    });

    socket.on("delete_room_message", (data) => {
      socket.broadcast.emit("delete_room_message", data);
    });

    socket.on("update_room_message_action", (data) => {
      socket.broadcast.emit("update_room_message_action", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  let ai: GoogleGenAI | null = null;

  app.post("/api/github/sync", async (req, res) => {
    try {
      const { path: filePath, content, message, owner, repo, branch, token } = req.body || {};
      if (!content) {
        return res.status(400).json({ success: false, error: "Konten kode website tidak boleh kosong." });
      }

      const targetPath = (filePath || "index.html").trim();
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
      console.error("Error in /api/github/sync:", err);
      return res.status(400).json({
        success: false,
        error: err.message || "Gagal melakukan sinkronisasi ke GitHub."
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
      if (!key) {
        return res.status(200).json({
          responseText: "Maaf, API Key Gemini belum disetting di environment variables. Silakan tambahkan GEMINI_API_KEY di Settings > Secrets.",
          toolUsed: "Error",
          status: "Ditolak (No API Key)"
        });
      }

      if (!ai) {
        ai = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: { 'User-Agent': 'aistudio-build' }
          }
        });
      }

      const { prompt, message, history, systemPrompt, file, mode } = req.body || {};
      const userPrompt = (prompt || message || "").trim();
      if (!userPrompt && !file) {
        return res.status(200).json({
          responseText: "Silakan masukkan pesan.",
          toolUsed: "Error",
          status: "Gagal"
        });
      }
      const lowerPrompt = userPrompt.toLowerCase();

      // INTERCEPT TEST AGENT (SINGLE FILE VIA OCTOKIT)
      if (lowerPrompt.includes("test agent")) {
        try {
          const commitUrl = await commitFileToGithub(
            "TEST_AGENT.md", 
            "# TEST AGENT\n\nIni adalah file test buatan Bara AI! Berhasil di-upload via Octokit API.", 
            "test: create TEST_AGENT.md via agent"
          );
          return res.status(200).json({
            responseText: `Berhasil! File TEST_AGENT.md udah di-commit ke GitHub via Octokit.\n\n[Cek File Commit Disini](${commitUrl})`,
            toolUsed: "Deploy Tools",
            status: "Selesai"
          });
        } catch (e: any) {
          console.error("Test agent error:", e);
          return res.status(200).json({
            responseText: `Gagal test agent: ${e.message}`,
            toolUsed: "Error",
            status: "Gagal"
          });
        }
      }

      // Transform history for better context
      let chatContext = "";
      if (history && history.length > 0) {
        chatContext = history.slice(-6).map((msg: any) => {
          const sender = msg.sender === 'user' || msg.role === 'user' ? 'User' : 'Agent';
          const text = msg.text || (msg.parts && msg.parts[0] ? msg.parts[0].text : '');
          return `${sender}: ${text}`;
        }).filter(Boolean).join('\n\n');
      }

      const unifiedPrompt = systemPrompt || `Kamu adalah BARA AI & WEB AI: Asisten AI pribadi cerdas, proaktif, dan Full-Stack Software Engineer handal.

Tugas & Identitas:
Membantu pengguna dengan berbagai kebutuhan percakapan cerdas, tanya-jawab, analisis, konsultasi, coding, serta pembuatan website dan aplikasi web modern berkualitas tinggi.

Mode Operasi Terpadu:
1. Mode Bara AI (Chat):
   - Berfokus murni pada percakapan interaktif, konsultasi, tanya jawab, penjelasan konsep, penalaran, dan asistensi cerdas.
   - Pada mode Bara AI, kamu HANYA melayani chat dan diskusi, TIDAK membuat website utuh yang ditujukan untuk web preview.
2. Mode Web AI (Pembuat Website):
   - Berfokus pada perancangan dan pembuatan website serta aplikasi web (Full-Stack).
   - Setiap kali user meminta dibuatkan website, landing page, atau aplikasi web pada mode ini, buatkan kode lengkap yang interaktif, modern, dan responsif menggunakan HTML5, Tailwind CSS, JavaScript interaktif, dan penyimpanan lokal (localStorage).
   - Seluruh kode website wajib dibungkus rapi dalam format \`\`\`html ... \`\`\` agar dapat langsung dijalankan dan ditampilkan pada Web Preview.

Aturan & Gaya Komunikasi:
- Ramah, keren, profesional, solutif, dan informatif.
- Setiap kode pemrograman WAJIB dibungkus dalam markdown code block sesuai bahasa (contoh: \`\`\`html, \`\`\`javascript, \`\`\`python).
- Jangan lakukan hal ilegal atau berbahaya. Selalu berikan solusi terbaik dan kode yang rapi.`;

      const currentMode = mode === 'web' ? 'web' : 'ai';

      const finalSystemInstruction = `KAMU HARUS MEMATUHI INSTRUKSI SISTEM INI DENGAN KETAT DAN TANPA TERKECUALI:

<system_prompt_terpadu>
${unifiedPrompt}
</system_prompt_terpadu>

MODE OPERASI AKTIF: ${currentMode === 'web' ? 'MODE WEB AI (PEMBUAT WEBSITE)' : 'MODE BARA AI (CHAT SAJA)'}

${currentMode === 'web' 
  ? `ATURAN MODE WEB AI:
- Pengguna berada di mode Web AI untuk membuat, mendesain, atau merevisi website/aplikasi web.
- Jika pengguna meminta website, landing page, dashboard, game web, atau aplikasi web, kamu WAJIB menghasilkan kode Single-File Full-Stack utuh dan lengkap yang dibungkus di dalam format \`\`\`html ... \`\`\`.
- Gunakan Tailwind CSS (CDN), ikon FontAwesome atau SVG, dan JavaScript interaktif dengan penyimpanan data lokal (localStorage) agar aplikasi langsung aktif dan bisa digunakan di Web Preview.
- Jelaskan secara ringkas fitur dan keunggulan website yang dibuat.`
  : `ATURAN MODE BARA AI:
- Pengguna berada di mode Bara AI (Chat Saja).
- Kamu HANYA melayani percakapan, tanya-jawab, konsultasi ide, penalaran, diskusi, dan asistensi umum.
- JANGAN membuat website utuh yang ditujukan untuk Web Preview pada mode Bara AI ini. Jawablah langsung secara percakapan yang jelas, ramah, dan solutif.`}

ATURAN WAJIB SISTEM KELUARAN:
1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan (responseText, toolUsed, status).
2. Setiap kali kamu memberikan kode atau skrip pemrograman (Python, HTML, Node.js, JavaScript, CSS, SQL, Shell, dll), kamu WAJIB membungkus kode tersebut di dalam format markdown code block bertanda bahasa (contoh: \`\`\`python\n...\n\`\`\` atau \`\`\`html\n...\n\`\`\`).
3. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property "gitAction" di JSON dengan "commitMessage" yang mendeskripsikan perubahan tersebut.`;

      const promptWithContext = `Konteks percakapan sebelumnya:\n${chatContext}\n\nPertanyaan/Perintah User saat ini:\n${userPrompt}`;

      const candidateModels = [
        "gemini-3.8-flash",
        "gemini-flash-latest",
        "gemini-3.1-flash-lite"
      ];

      let response: any = null;
      let lastError: any = null;

      const inlineData = (file && file.dataUrl && typeof file.dataUrl === 'string' && file.dataUrl.includes(','))
        ? { data: file.dataUrl.split(',')[1], mimeType: file.mimeType || 'image/jpeg' }
        : null;

      for (const modelName of candidateModels) {
        let retries = 1;
        let delay = 600;
        let success = false;

        while (retries >= 0) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents: inlineData ? [
                { text: promptWithContext },
                { inlineData }
              ] : promptWithContext,
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
            success = true;
            break;
          } catch (err: any) {
            lastError = err;
            const isBusy = err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("UNAVAILABLE") || err?.message?.includes("high demand") || err?.message?.includes("RESOURCE_EXHAUSTED");
            if (isBusy && retries > 0) {
              retries--;
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2;
            } else {
              break;
            }
          }
        }

        if (success) break;
      }

      if (!response) {
        throw lastError || new Error("Semua model Gemini sedang sibuk. Silakan coba beberapa saat lagi.");
      }

      let output: any = {};
      try {
        const rawOutput = (response?.text || "").trim();
        const cleanedStr = rawOutput
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim();
        output = JSON.parse(cleanedStr);
      } catch (parseErr) {
        console.warn("JSON parse fallback in server.ts:", parseErr);
        output = {
          responseText: response?.text || "Selesai memproses respon.",
          toolUsed: "Umum",
          status: "Selesai"
        };
      }

      if (!output.responseText) {
        output.responseText = response?.text || "Selesai memproses pesan.";
      }
      if (!output.toolUsed) output.toolUsed = "Umum";
      if (!output.status) output.status = "Selesai";
      
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
            output.responseText += "\n\nBerhasil! Kode udah di-commit dan di-push ke GitHub. [Link Commit](https://github.com/baraofficial/Universe-Agent-v24.-04/commits/main)";
            output.toolUsed = "Deploy Tools";
            output.status = "Selesai";
          }
        } catch (e: any) {
          console.error("Git error:", e);
          output.responseText += `\n\nGagal nge-push: ${e.message}`;
          output.toolUsed = "Error";
          output.status = "Gagal";
        }
      }
      
      res.status(200).json(output);
    } catch (error: any) {
      console.error("Gemini error in /api/chat:", error);
      res.status(200).json({
        responseText: `Waduh, ada kendala saat memproses dengan Gemini: ${error?.message || 'Server error'}. Silakan coba kirim ulang perintah Anda.`,
        toolUsed: "Error",
        status: "Gagal"
      });
    }
  });

  // Global error handler untuk route server (selalu kirim JSON, hindari HTML/teks error mentah)
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server unhandled error:', err);
    if (res.headersSent) {
      return next(err);
    }
    res.status(200).json({
      responseText: "Waduh, terjadi kesalahan sistem pada server: " + (err?.message || 'Unknown Server Error'),
      toolUsed: "Error",
      status: "Gagal"
    });
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

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
