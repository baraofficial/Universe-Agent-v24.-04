import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

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

    const { prompt, message, history, systemPrompt, baraPrompt, file } = req.body || {};
    const userPrompt = (prompt || message || "").trim();
    if (!userPrompt && !file) {
      return res.status(200).json({ responseText: "Prompt tidak boleh kosong.", toolUsed: "Error", status: "Gagal" });
    }

    // Keep context concise (last 4 messages) for lightning-fast token processing
    let chatContext = "";
    if (history && Array.isArray(history) && history.length > 0) {
      chatContext = history.slice(-4).map((msg: any) => {
        const sender = msg.sender === 'user' || msg.role === 'user' ? 'User' : 'Agent';
        const text = msg.text || (msg.parts && msg.parts[0] ? msg.parts[0].text : '');
        return `${sender}: ${text}`;
      }).filter(Boolean).join('\n\n');
    }

    const DEFAULT_SYSTEM_INSTRUCTION = `Kamu adalah BARA AI: Asisten kecerdasan buatan super cepat, cerdas, solutif, lugas, dan patuh pada instruksi pengguna.
Prinsip Utama:
1. Fast Response & Direct: Berikan jawaban secara langsung, cepat, akurat, dan to the point tanpa pembuka klise (jangan pakai "Tentu!", "Sebagai AI", dll).
2. Format Kode: Jika memberikan kode pemrograman, WAJIB bungkus dalam markdown code block bertanda bahasa (contoh: \`\`\`python ... \`\`\`).
3. Kepatuhan Penuh: Ikuti gaya, bahasa, dan instruksi yang diinginkan pengguna.`;

    const activePrompt = (baraPrompt || systemPrompt || DEFAULT_SYSTEM_INSTRUCTION).trim();

    const finalSystemInstruction = `${activePrompt}

ATURAN OUTPUT (JSON):
- Keluarkan respons dalam JSON valid dengan properti: responseText (string jawaban langsung), toolUsed (string tool relevan), status (string "Selesai").
- Jawab secara ringkas, padat, dan cepat tanpa membuang waktu.`;

    const promptWithContext = chatContext 
      ? `Konteks sebelumnya:\n${chatContext}\n\nPertanyaan/Perintah User:\n${userPrompt}`
      : userPrompt;

    // Model tercepat diprioritaskan: gemini-3.1-flash-lite (latency terendah, minimal thinking)
    const candidateModels = [
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash"
    ];

    let response: any = null;
    let lastError: any = null;

    const inlineData = (file && file.dataUrl && typeof file.dataUrl === 'string' && file.dataUrl.includes(','))
      ? { data: file.dataUrl.split(',')[1], mimeType: file.mimeType || 'image/jpeg' }
      : null;

    for (const modelName of candidateModels) {
      try {
        const isModel38 = modelName === 'gemini-3.8-flash';
        
        // Fast configuration: low thinking overhead for fast response
        const config: any = {
          systemInstruction: finalSystemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              responseText: {
                type: Type.STRING,
                description: "Jawaban langsung dari Bara AI. Format markdown didukung."
              },
              toolUsed: {
                type: Type.STRING,
                description: "Tool atau kategori yang relevan."
              },
              status: {
                type: Type.STRING,
                description: "Status eksekusi, default 'Selesai'."
              }
            },
            required: ["responseText", "toolUsed", "status"]
          }
        };

        // Minimize thinking latency for fast response on Vercel
        if (isModel38) {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
        }

        response = await ai.models.generateContent({
          model: modelName,
          contents: inlineData ? [
            { text: promptWithContext },
            { inlineData }
          ] : promptWithContext,
          config
        });

        if (response && response.text) {
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} gagal di Vercel:`, err?.message || err);
        // Continue immediately to next candidate model without long delay
      }
    }

    if (!response) {
      throw lastError || new Error("Semua model Gemini sedang sibuk. Silakan coba sesaat lagi.");
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
    } catch {
      output = {
        responseText: response?.text || "Selesai merespons.",
        toolUsed: "Umum",
        status: "Selesai"
      };
    }

    return res.status(200).json(output);
  } catch (error: any) {
    console.error("Vercel Gemini Fast API Error:", error);
    return res.status(200).json({
      responseText: `Terjadi kendala saat menghubungi AI: ${error?.message || String(error)}`,
      toolUsed: "Error",
      status: "Gagal"
    });
  }
}
