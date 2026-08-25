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
          systemInstruction: systemPrompt || "Kamu adalah BARA AGENT. Jawab dengan santai, gunakan kata sapaan 'cak'. Jawab dalam format JSON sesuai schema. Jika user meminta untuk commit dan push ke github atau update github, isi property gitAction di JSON dengan commitMessage yang sesuai dengan apa yang baru saja dilakukan atau diminta.",
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
  
  res.json(output);
}
