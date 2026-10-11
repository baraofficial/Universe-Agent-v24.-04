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
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!key) {
      return res.status(200).json({
        responseText: "Maaf, API Key Gemini belum dikonfigurasi. Silakan tambahkan GEMINI_API_KEY di panel Settings > Secrets.",
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

    const { prompt, message, history, systemPrompt, file } = req.body || {};
    const userPrompt = (prompt || message || "").trim();
    if (!userPrompt && !file) {
      return res.status(200).json({ responseText: "Prompt tidak boleh kosong.", toolUsed: "Error", status: "Gagal" });
    }

    let chatContext = "";
    if (history && Array.isArray(history) && history.length > 0) {
      chatContext = history.slice(-6).map((msg: any) => {
        const sender = msg.sender === 'user' || msg.role === 'user' ? 'User' : 'Agent';
        const text = msg.text || (msg.parts && msg.parts[0] ? msg.parts[0].text : '');
        return `${sender}: ${text}`;
      }).filter(Boolean).join('\n\n');
    }

    const finalSystemInstruction = `KAMU HARUS MEMATUHI INSTRUKSI SYSTEM INI DENGAN KETAT DAN TANPA TERKECUALI:

<system_prompt_dari_user>
${systemPrompt || "Kamu adalah Bara AI asisten cerdas, kreatif, profesional, dan Full-Stack Software Engineer handal."}
</system_prompt_dari_user>
ATURAN WAJIB SISTEM KELUARAN (TIDAK BOLEH DILANGGAR):
1. Kamu WAJIB merespons DALAM FORMAT JSON sesuai dengan schema yang diberikan.
2. Setiap kali kamu memberikan kode atau skrip pemrograman (Python, HTML, Node.js, JavaScript, CSS, SQL, Shell, dll), kamu WAJIB membungkus kode tersebut di dalam format markdown code block bertanda bahasa, contoh: \`\`\`python\n...\n\`\`\` atau \`\`\`html\n...\n\`\`\`. DILARANG menyatukan kode ke paragraf biasa tanpa code block!
3. ATURAN WAJIB PEMBUATAN WEBSITE / WEB APP (WAJIB SELALU FULL STACK):
   Setiap kali user meminta dibuatkan website, landing page, sistem web, atau aplikasi web dalam bentuk apa pun, kamu WAJIB membuatnya menjadi **FULL STACK** secara utuh dan interaktif:
   - Sediakan arsitektur Full Stack lengkap:
     a. Frontend Modern: Antarmuka yang estetis, responsif, modern (menggunakan Tailwind CSS cdn, FontAwesome / ikon, layout rapi, dark/light mode harmonis, animasi interaktif).
     b. Backend & API Service: Logika backend terintegrasi lengkap (REST API endpoints atau service layer mandiri dengan routing dan controller untuk operasi CRUD: Create, Read, Update, Delete, validasi data, serta penanganan error).
     c. Database & Persistence Layer: Sistem database fungsional (seperti database lokal persisten dengan localStorage/IndexedDB atau simulated in-memory DB) sehingga data benar-benar tersimpan, dapat ditambah, diubah, dicari, dan dihapus secara langsung.
   - Seluruh kode yang dibungkus dalam \`\`\`html ... \`\`\` WAJIB merupakan Single-File Full Stack Web Application mandiri yang langsung berjalan 100% aktif dan dapat dioperasikan seketika di Web Preview tanpa kekurangan logika backend.
   - Jelaskan arsitektur Full Stack yang kamu bangun (Frontend UI, daftar REST API Endpoints, dan struktur Database) agar user memahami seluruh komponen sistemnya.
4. Jika user meminta untuk melakukan update ke github, commit, atau push kode, kamu WAJIB mengisi property 'gitAction' di JSON dengan 'commitMessage' yang mendeskripsikan perubahan tersebut.
5. Selalu patuhi identitas, gaya bahasa, aturan, dan larangan yang ditetapkan dalam <system_prompt_dari_user> di atas.`;

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
      const outputStr = (response?.text || "").trim();
      const cleaned = outputStr
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();
      output = JSON.parse(cleaned);
    } catch (parseErr) {
      output = {
        responseText: response?.text || "Selesai merespons.",
        toolUsed: "Umum",
        status: "Selesai"
      };
    }
    return res.status(200).json(output);
  } catch (error: any) {
    console.error("Serverless Gemini Error:", error);
    return res.status(200).json({
      responseText: `Waduh, terjadi error saat menghubungi Gemini: ${error?.message || String(error)}`,
      toolUsed: "Error",
      status: "Gagal"
    });
  }
}
