import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(200).json({
      responseText: "Maaf cak, API Key Gemini belum disetting di environment variables. Silakan tambahkan GEMINI_API_KEY.",
      toolUsed: "Error",
      status: "Ditolak (No API Key)"
    });
  }

  const ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' }
    }
  });

  const { prompt, history, systemPrompt } = req.body;
  const lowerPrompt = prompt.toLowerCase();

  // INTERCEPT TEST AGENT (SINGLE FILE VIA OCTOKIT)
  if (lowerPrompt.includes("test agent")) {
    return res.json({
      responseText: `Test agent mock fallback for Vercel.`,
      toolUsed: "Deploy Tools",
      status: "Selesai"
    });
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
        // Di Vercel (Serverless), tidak bisa pakai simple-git untuk modif lokal direktori
        output.responseText += "\n\n[Info Serverless] Saat ini agent berjalan di server cloud (Vercel). Fitur local 'git add & push' tidak dapat memodifikasi repositori cloud secara langsung dari chat ini, namun integrasi GitHub API tetap berjalan normal.";
        output.toolUsed = "Deploy Tools";
        output.status = "Selesai (Serverless Mode)";
      } else {
        // Fallback untuk local Express (jika api/chat.ts dipanggil lokal)
        const { runGitAdd, runGitCommit, runGitPush } = await import('../src/tools/git.js');
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
      output.responseText += `\nGagal nge-push cak: ${e.message}`;
      output.toolUsed = "Error";
      output.status = "Gagal";
    }
  }

  res.json(output);
}
