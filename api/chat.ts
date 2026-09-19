import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

let ai: GoogleGenAI | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ responseText: 'Method Not Allowed', toolUsed: 'Error', status: 'Gagal' });
  }

  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(200).json({
        responseText: "Maaf, API Key Gemini belum dikonfigurasi di Vercel. Silakan tambahkan GEMINI_API_KEY di Vercel Project Settings > Environment Variables.",
        toolUsed: "Error",
        status: "Ditolak (No API Key)"
      });
    }

    if (!ai) {
      ai = new GoogleGenAI({ apiKey: key });
    }

    const { prompt, history, systemPrompt, file } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ responseText: "Prompt tidak boleh kosong.", toolUsed: "Error", status: "Gagal" });
    }

    let chatContext = "";
    if (history && Array.isArray(history) && history.length > 0) {
      chatContext = history.slice(-6).map((msg: any) => 
        `${msg.sender === 'user' ? 'User' : 'Agent'}: ${msg.text}`
      ).join('\n\n');
    }

    const finalSystemInstruction = `KAMU HARUS MEMATUHI INSTRUKSI SYSTEM INI DENGAN KETAT DAN TANPA TERKECUALI:

<system_prompt_dari_user>
${systemPrompt || "Kamu adalah Bara, AI Agent teman ngobrol yang asik, cerdas, kreatif dan profesional."}
</system_prompt_dari_user>
ATURAN WAJIB SISTEM KELUARAN (TIDAK BOLEH DILANGGAR):\n1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan.\n2. Setiap kali kamu memberikan kode atau skrip pemrograman (Python, HTML, Node.js, JavaScript, CSS, SQL, Shell, dll), kamu WAJIB membungkus kode tersebut di dalam format markdown code block bertanda bahasa, contoh: \`\`\`python\\n...\\n\`\`\` atau \`\`\`html\\n...\\n\`\`\`. DILARANG menyatukan kode ke paragraf biasa tanpa code block!\n3. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property 'gitAction' di JSON dengan 'commitMessage' yang mendeskripsikan perubahan tersebut.\n4. Selalu patuhi identitas, gaya bahasa, aturan, dan larangan yang ditetapkan dalam <system_prompt_dari_user> di atas.`;

    const promptWithContext = `Konteks percakapan sebelumnya:\n${chatContext}\n\nPertanyaan/Perintah User saat ini:\n${prompt}`;

    const candidateModels = [
      "gemini-3.8-flash",
      "gemini-flash-latest",
      "gemini-3.1-flash-lite",
      "gemini-3.1-pro-preview"
    ];

    let response: any = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      let retries = 2;
      let delay = 500;
      let success = false;

      while (retries > 0) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents: file ? [
              { text: promptWithContext },
              { inlineData: { data: file.dataUrl.split(',')[1], mimeType: file.mimeType } }
            ] : promptWithContext,
            config: {
              systemInstruction: finalSystemInstruction,
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  responseText: {
                    type: Type.STRING,
                    description: "Jawaban dari agent. Jika menyertakan sumber referensi, gunakan format markdown link [Nama Sumber](URL)."
                  },
                  toolUsed: {
                    type: Type.STRING,
                    description: "Tool yang relevan (Browser, Kalkulator, Catatan, Umum, dsb.)"
                  },
                  status: {
                    type: Type.STRING,
                    description: "Status eksekusi (Selesai, Ditolak (Ilegal), dll)"
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
          const isBusy = err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("UNAVAILABLE") || err?.message?.includes("high demand");
          if (isBusy) {
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 2;
            }
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

    const outputStr = response?.text || "{}";
    const output = JSON.parse(outputStr);
    return res.status(200).json(output);
  } catch (error: any) {
    console.error("Vercel Serverless Gemini Error:", error);
    return res.status(200).json({
      responseText: `Waduh, terjadi error saat menghubungi Gemini di Vercel: ${error?.message || String(error)}`,
      toolUsed: "Error",
      status: "Gagal"
    });
  }
}
