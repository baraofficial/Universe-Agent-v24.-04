/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * APLIKASI WEB: BARA AGENT
 * TEMA: Hitam #0A0A0A dan Ungu #8B5CF6 (Futuristik, Dark, Glassmorphism)
 * FONT: Orbitron & JetBrains Mono
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';

import {
 Wrench,
 Bot,
 User,
 Send,
 Sparkles,
 Globe,
 Calculator,
 FileText,
 CheckCircle2,
 Clock,
 Save,
 Trash2,
 Terminal,
 Activity,
 Cpu,
 Zap,
 ShieldAlert,
 ChevronRight,
 RotateCcw,
 Check,
 AlertCircle,
 Github,
 Code,
 FolderArchive,
 Image as ImageIcon,
 Database as DatabaseIcon,
 MessageSquare,
 History,
 UserCircle,
 Plus,
 Upload,
 Camera
, ArrowDown, Rocket, Download, Edit2, Copy, FileCode, Eye, Check as CheckIcon} from 'lucide-react';

// ============================================================================
// STRUKTUR DATA (TYPES & INTERFACES)
// ============================================================================

/** Struktur data untuk pesan chat antara User dan AI Agent */
interface ChatMessage {
 id: string;
 sender: 'user' | 'ai';
 text: string;
 timestamp: string;
 toolUsed?: string; // Nama tool yang digunakan Agent jika relevan
}

/** Struktur data untuk daftar riwayat tugas yang selesai dikerjakan Agent */
interface TaskHistoryItem {
 id: string;
 command: string;
 status: 'Selesai' | 'Ditolak (Ilegal)';
 toolUsed: 'Browser' | 'Kalkulator' | 'Catatan' | 'Umum';
 timestamp: string;
 responseSummary: string;
}

/** Struktur data untuk catatan yang disimpan melalui Tool Catatan */
interface SavedNote {
 id: string;
 content: string;
 timestamp: string;
}

// ============================================================================
// KONSTANTA & DEFAULT VALUE
// ============================================================================

/** System Prompt Default sesuai dengan instruksi spesifikasi */
const DEFAULT_SYSTEM_PROMPT =
 "Kamu adalah BARA AGENT. Asisten AI pribadi yg cerdas dan proaktif. \n" +
 "Tugas: Bantu user menyelesaikan tugas. Gaya bahasa: Santai, panggil user 'cak'. \n" +
 "Aturan: Jangan lakukan hal ilegal. Jika tidak bisa, jelaskan kenapa.";

/** Kunci penyimpanan lokal (localStorage) */
const STORAGE_KEY_PROMPT = 'bara_agent_system_prompt';
const STORAGE_KEY_CHAT = 'bara_agent_chat_history';
const STORAGE_KEY_TASKS = 'bara_agent_task_history';
const STORAGE_KEY_NOTES = 'bara_agent_saved_notes';
const STORAGE_KEY_USERNAME = 'bara_agent_username';

/** Daftar Tools yang tersedia untuk BARA AGENT */
const AGENT_TOOLS = [
 {
 id: 'Browser',
 name: 'Browser',
 icon: Globe,
 description: 'Menelusuri informasi terkini dan referensi dunia maya',
 keywords: ['cari', 'search', 'berita', 'siapa', 'apa itu', 'browser', 'info', 'kapan', 'dimana']
 },
 {
 id: 'Kalkulator',
 name: 'Kalkulator',
 icon: Calculator,
 description: 'Menghitung operasi matematika aritmatika dan rumus angka',
 keywords: ['hitung', 'kalkulator', 'berapa', 'tambah', 'kurang', 'kali', 'bagi', '+', '-', '*', '/']
 },
 {
 id: 'Catatan',
 name: 'Catatan',
 icon: FileText,
 description: 'Mencatat, menyimpan, dan mengingatkan poin penting user',
 keywords: ['catat', 'ingat', 'catatan', 'simpan', 'tuliskan', 'ingatkan', 'note']
 },
 {
 id: 'GithubConnector',
 name: 'GithubConnector',
 icon: Github,
 description: 'Menghubungkan ke repo Github. Bisa baca file, edit code, dan push commit.',
 keywords: ['github', 'repo', 'commit', 'push', 'code']
 },
 {
 id: 'CodeEditor',
 name: 'CodeEditor',
 icon: Code,
 description: 'Membaca, menganalisis, dan mengedit file .js .tsx .py. Bisa debug error.',
 keywords: ['code', 'edit', 'debug', 'js', 'tsx', 'py', 'editor']
 },
 {
 id: 'FileManager',
 name: 'FileManager',
 icon: FolderArchive,
 description: 'Upload, ekstrak, dan download file .zip .pdf .docx.',
 keywords: ['file', 'upload', 'download', 'zip', 'pdf', 'docx', 'ekstrak']
 },
 {
 id: 'ImageGenerator',
 name: 'ImageGenerator',
 icon: ImageIcon,
 description: 'Membuat gambar dari teks prompt. Tema: Futuristik Dark & Purple.',
 keywords: ['gambar', 'image', 'generate', 'lukis', 'buat gambar']
 },
 {
 id: 'Database',
 name: 'Database',
 icon: DatabaseIcon,
 description: 'Menyimpan data produk, user, dan chat. Bisa search dan update.',
 keywords: ['db', 'database', 'simpan', 'data', 'search', 'update']
 },
 {
 id: 'Code Execution',
 name: 'Code Execution',
 icon: Terminal,
 description: 'Mengeksekusi kode program secara langsung dalam sandbox',
 keywords: ['code', 'eksekusi', 'jalankan', 'run', 'script', 'program', 'terminal']
 },
 {
 id: 'Function Calling',
 name: 'Function Calling',
 icon: Code,
 description: 'Memanggil fungsi API eksternal dan custom functions',
 keywords: ['fungsi', 'api', 'panggil', 'function', 'calling', 'eksternal']
 },
 {
 id: 'Multimodal',
 name: 'Multimodal',
 icon: ImageIcon,
 description: 'Menganalisis dan memproses gambar serta input multimodal lainnya',
 keywords: ['gambar', 'image', 'multimodal', 'foto', 'lihat', 'analisis', 'visual']
 },
 {
 id: 'GithubAPI',
 name: 'GitHub API',
 icon: Github,
 description: 'Mengakses GitHub API via Octokit untuk membaca/menulis file',
 keywords: ['github', 'octokit', 'api', 'baca', 'tulis', 'repo']
 },
 {
 id: 'GitCLI',
 name: 'Git CLI',
 icon: Terminal,
 description: 'Menjalankan perintah Git CLI via simple-git (add, commit, push, pull)',
 keywords: ['git', 'cli', 'commit', 'push', 'pull', 'add']
 },
 {
 id: 'Deploy Tools',
 name: 'Deploy Tools',
 icon: Rocket,
 description: 'Mendeploy aplikasi dan tools ke server atau cloud',
 keywords: ['deploy', 'publish', 'upload', 'server', 'hosting', 'cloud']
 }
] as const;

// ============================================================================
// KOMPONEN UTAMA APLIKASI (APP.TSX)
// ============================================================================


// ============================================================================
// KOMPONEN CODE BLOCK
// ============================================================================
const CodeBlock = ({ content }: { content: string; key?: number | string }) => {
 const [copied, setCopied] = useState(false);
 const [showFull, setShowFull] = useState(false);
 
 // parse language and code
 const match = content.match(/```(\w*)\n([\s\S]*?)```/);
 const language = match && match[1] ? match[1] : 'code';
 const code = match ? match[2] : content.replace(/```/g, '');

 const handleCopy = () => {
 navigator.clipboard.writeText(code);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
 };

 return (
 <div className="my-4 rounded-xl border border-purple-500/40 bg-[#0A0A0C] overflow-hidden w-full max-w-full">
 <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416]/90 border-b border-purple-500/30">
 <div className="flex items-center gap-2">
 <FileCode className="w-4 h-4 text-purple-400" />
 <span className="text-xs font-mono text-purple-300 uppercase tracking-wider">{language || 'text'}</span>
 </div>
 <div className="flex gap-2">
 <button 
 type="button"
 onClick={() => setShowFull(!showFull)}
 className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors text-xs font-medium cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 {showFull ? 'Tutup' : 'Lihat Code'}
 </button>
 <button 
 type="button"
 onClick={handleCopy}
 className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors text-xs font-medium cursor-pointer"
 >
 {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
 {copied ? 'Tersalin' : 'Salin Code'}
 </button>
 </div>
 </div>
 <div className={`p-4 overflow-x-auto text-[13px] sm:text-sm font-mono text-gray-300 leading-relaxed ${showFull ? '' : 'max-h-64'}`}>
 <pre className="whitespace-pre">
 <code>{code}</code>
 </pre>
 </div>
 </div>
 );
};

export default function App() {
 const renderMessageText = (text: string) => {
 // 1. Pisahkan berdasarkan code blocks markdown
 const codeBlockRegex = /(```[\s\S]*?```)/g;
 const blocks = text.split(codeBlockRegex);

 return blocks.map((block, index) => {
 if (block.startsWith('```') && block.endsWith('```')) {
 return <CodeBlock key={index} content={block} />;
 }

 // 2. Parse links dan bold text
 const linkParts = block.split(/(\[.*?\]\(.*?\))/g);
 return (
 <span key={index}>
 {linkParts.map((part, pIndex) => {
 const match = part.match(/\[(.*?)\]\((.*?)\)/);
 if (match) {
 return (
 <a 
 key={pIndex} 
 href={match[2]} 
 target="_blank" 
 rel="noopener noreferrer" 
 className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors font-medium"
 >
 {match[1]}
 </a>
 );
 }
 
 const boldParts = part.split(/(\*\*.*?\*\*)/g);
 return (
 <span key={pIndex}>
 {boldParts.map((bPart, bIndex) => {
 const bMatch = bPart.match(/\*\*(.*?)\*\*/);
 if (bMatch) {
 return <strong key={bIndex} className="font-bold text-purple-200">{bMatch[1]}</strong>;
 }
 return bPart;
 })}
 </span>
 );
 })}
 </span>
 );
 });
 };

 // --- STATE SYSTEM PROMPT ---
 // Menyimpan isi System Prompt dari localStorage atau default prompt
 const [systemPrompt, setSystemPrompt] = useState<string>(() => {
 const saved = localStorage.getItem(STORAGE_KEY_PROMPT);
 return saved || DEFAULT_SYSTEM_PROMPT;
 });
 const [isPromptSavedToast, setIsPromptSavedToast] = useState<boolean>(false);

 // --- STATE USERNAME ---
 const [userName, setUserName] = useState<string>(() => {
 const saved = localStorage.getItem(STORAGE_KEY_USERNAME);
 return saved || 'Cak Bara';
 });
 const [isEditingUserName, setIsEditingUserName] = useState<boolean>(false);
 const [tempUserName, setTempUserName] = useState<string>('');

 useEffect(() => {
 localStorage.setItem(STORAGE_KEY_USERNAME, userName);
 }, [userName]);

 // --- STATE CHAT AREA ---
 // Menyimpan riwayat percakapan chat
 const [messages, setMessages] = useState<ChatMessage[]>(() => {
 const saved = localStorage.getItem(STORAGE_KEY_CHAT);
 if (saved) {
 try {
 return JSON.parse(saved);
 } catch {
 // Fallback jika json rusak
 }
 }
 // Pesan sapaan pembuka default dari AI Agent
 return [
 {
 id: 'welcome-1',
 sender: 'ai',
 text: 'Halo cak! Aku BARA AGENT, asisten AI futuristikmu yang aktif 24/7. Ada tugas atau perintah apa yang bisa kubantu hari ini cak?',
 timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
 toolUsed: 'Umum'
 }
 ];
 });

 // --- STATE BOTTOM NAV ---
 type TabType = 'chat' | 'prompt' | 'tools' | 'history' | 'account';
 const [activeTab, setActiveTab] = useState<TabType>('chat');

 // --- STATE INPUT PERINTAH ---
 const [inputCommand, setInputCommand] = useState<string>('');
 const [isThinking, setIsThinking] = useState<boolean>(false);
 const [activeToolBadge, setActiveToolBadge] = useState<string | null>(null);
 const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState<boolean>(false);

 // --- STATE RIWAYAT TUGAS & CATATAN ---
 // Menyimpan daftar perintah yang telah diproses oleh Agent
 const [taskHistory, setTaskHistory] = useState<TaskHistoryItem[]>(() => {
 const saved = localStorage.getItem(STORAGE_KEY_TASKS);
 if (saved) {
 try {
 return JSON.parse(saved);
 } catch {
 // fallback
 }
 }
 return [];
 });

 // Menyimpan data catatan jika Tool Catatan digunakan
 const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
 const saved = localStorage.getItem(STORAGE_KEY_NOTES);
 if (saved) {
 try {
 return JSON.parse(saved);
 } catch {
 // fallback
 }
 }
 return [];
 });

 // --- REFERENSI AUTO SCROLL CHAT ---
 const chatBottomRef = useRef<HTMLDivElement | null>(null);
 const chatContainerRef = useRef<HTMLDivElement | null>(null);
 const [showScrollButton, setShowScrollButton] = useState(false);

 const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
 const target = e.currentTarget;
 const isAtBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
 setShowScrollButton(!isAtBottom);
 };

 // --- EFEK SIMPAN KE LOCAL STORAGE SETIAP STATE BERUBAH ---
 useEffect(() => {
 localStorage.setItem(STORAGE_KEY_PROMPT, systemPrompt);
 }, [systemPrompt]);

 useEffect(() => {
 localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
 // Gulir otomatis ke bawah pada area chat setiap pesan baru bertambah
 chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages, isThinking]);

 useEffect(() => {
 localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(taskHistory));
 }, [taskHistory]);

 useEffect(() => {
 localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(savedNotes));
 }, [savedNotes]);

 // ============================================================================
 // FUNGSI SIMPAN SYSTEM PROMPT
 // ============================================================================
 /** Menyimpan kepribadian AI ke localStorage disertai efek notifikasi sementara */
 const handleSavePrompt = () => {
 localStorage.setItem(STORAGE_KEY_PROMPT, systemPrompt);
 setIsPromptSavedToast(true);
 setTimeout(() => {
 setIsPromptSavedToast(false);
 }, 2500);
 };

 // ============================================================================
 // FUNGSI LOGIKA INTELEGENSI AI AGENT (ENGINE SIMULASI)
 // ============================================================================
 /**
 * Menganalisis perintah user, menentukan tool yang relevan,
 * mendeteksi kueri ilegal, dan memberikan jawaban bersahabat "cak".
 */
 // FUNGSI MENGIRIM PESAN (DENGAN SIMULASI DELAY BERPIKIR 1.5 DETIK)
 // ============================================================================
 /**
 * Menangani aksi klik tombol "Kirim Perintah" atau tekan Enter pada textarea.
 * - Menampilkan pesan user di chat
 * - Menampilkan status "Agent sedang berpikir..." selama tepat 1500 ms
 * - Memproses jawaban dan mencatat ke Riwayat Tugas
 */
 const handleSendCommand = async (customText?: string) => {
 const textToSend = customText || inputCommand;
 if (!textToSend.trim() || isThinking) return;

 const timestampNow = new Date().toLocaleTimeString('id-ID', {
 hour: '2-digit',
 minute: '2-digit'
 });

 const newUserMessage: ChatMessage = {
 id: `user-${Date.now()}`,
 sender: 'user',
 text: textToSend.trim(),
 timestamp: timestampNow
 };

 const newMessagesList = [...messages, newUserMessage];
 setMessages(newMessagesList);
 setInputCommand('');

 setIsThinking(true);
 setActiveToolBadge(null);

 try {
 const response = await fetch('/api/chat', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json'
 },
 body: JSON.stringify({
 prompt: textToSend.trim(),
 history: messages,
 systemPrompt
 })
 });

 const result = await response.json();

 const aiReplyMessage: ChatMessage = {
 id: `ai-${Date.now()}`,
 sender: 'ai',
 text: result.responseText || "Maaf cak, terjadi kesalahan dalam menghasilkan respon.",
 timestamp: new Date().toLocaleTimeString('id-ID', {
 hour: '2-digit',
 minute: '2-digit'
 }),
 toolUsed: result.toolUsed || 'Umum'
 };

 setActiveToolBadge(result.toolUsed || 'Umum');

 const newHistoryItem: TaskHistoryItem = {
 id: `task-${Date.now()}`,
 command: textToSend.trim(),
 status: result.status || 'Selesai',
 toolUsed: result.toolUsed || 'Umum',
 timestamp: timestampNow,
 responseSummary:
 (result.responseText || '').length > 55
 ? (result.responseText || '').substring(0, 55) + '...'
 : (result.responseText || '')
 };

 setMessages((prev) => [...prev, aiReplyMessage]);
 setTaskHistory((prev) => [newHistoryItem, ...prev]);
 } catch (error) {
 console.error(error);
 const aiReplyMessage: ChatMessage = {
 id: `ai-${Date.now()}`,
 sender: 'ai',
 text: "Waduh cak, terjadi kesalahan sistem: " + String(error),
 timestamp: new Date().toLocaleTimeString('id-ID', {
 hour: '2-digit',
 minute: '2-digit'
 }),
 toolUsed: 'Error'
 };
 setMessages((prev) => [...prev, aiReplyMessage]);
 } finally {
 setIsThinking(false);
 }
 };

 // ============================================================================
 // FUNGSI RESET / BERSIHKAN DATA
 // ============================================================================
 /** Menghapus riwayat chat dan mengembalikan ke pesan sapaan awal */
 const handleClearChat = () => {
 const defaultWelcome: ChatMessage[] = [
 {
 id: 'welcome-reset',
 sender: 'ai',
 text: 'Riwayat chat telah dibersihkan cak! BARA AGENT siap menerima perintah baru.',
 timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
 toolUsed: 'Umum'
 }
 ];
 setMessages(defaultWelcome);
 localStorage.removeItem(STORAGE_KEY_CHAT);
 };

 /** Menghapus seluruh riwayat tugas yang selesai dikerjakan */
 const handleClearTaskHistory = () => {
 setTaskHistory([]);
 localStorage.removeItem(STORAGE_KEY_TASKS);
 };

 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleFileUploadClick = () => {
 setIsAttachmentMenuOpen(false);
 fileInputRef.current?.click();
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (file) {
 handleSendCommand(`Tolong proses file ini cak: ${file.name}`);
 // Reset input
 e.target.value = '';
 }
 };

 // ============================================================================
 // RENDER UI UTAMA APLIKASI
 // ============================================================================
 return (
 <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
 {/* 
 =======================================================================
 1. HEADER APLIKASI
 Logo "BARA AGENT" warna ungu dengan efek glow & status "Agent: Online"
 =======================================================================
 */}
 <header className="border-b border-purple-900/50 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
 <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
 {/* Logo dengan Efek Glow Ungu Neon */}
 <div className="flex items-center gap-3">
 <div className="relative">
 {/* Cincin Glow di bawah ikon */}
 <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur-md opacity-75 animate-pulse" />
 <div className="relative bg-[#140F2A] border border-purple-500/50 p-2.5 rounded-xl ">
 <Wrench className="w-6 h-6 text-purple-400" />
 </div>
 </div>

 <div>
 <div className="flex items-center gap-2">
 <h1 className="text-xl sm:text-2xl font-black tracking-wider text-purple-400 font-orbitron glow-purple-text">
 Bara Agent by Bara Official
 </h1>
 <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono">
 v24.04
 </span>
 </div>
 <p className="text-xs text-purple-300/70 hidden sm:block font-mono">
 [AUTONOMOUS AI SYSTEM // PROTOCOL: CAK_ONLINE]
 </p>
 </div>
 </div>

 {/* Status "Agent: Online" & Tombol Kontrol */}
 <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
 {/* Indikator Status Online dengan Neon Dot */}
 <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#130E24] border border-purple-500/40 ">
 <span className="relative flex h-2.5 w-2.5">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 glow-green-sm"></span>
 </span>
 <span className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide font-mono">
 Agent: Online
 </span>
 </div>

 {/* Tombol Bersihkan Chat */}
 <button
 onClick={handleClearChat}
 title="Bersihkan layar chat"
 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141414] hover:bg-red-950/40 border border-gray-800 hover:border-red-500/50 text-gray-400 hover:text-red-300 transition-all text-xs font-mono cursor-pointer"
 >
 <RotateCcw className="w-3.5 h-3.5" />
 <span className="hidden md:inline">Reset Chat</span>
 </button>
 </div>
 </div>
 </header>

 {/* 
 =======================================================================
 KONTEN UTAMA APLIKASI (TAB BASED)
 =======================================================================
 */}
 <main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-28 max-w-3xl">
 {activeTab === 'chat' && (
 <section className="flex flex-col flex-1 bg-[#0E0E12]/90 border border-purple-900/50 rounded-3xl overflow-hidden backdrop-blur-xl relative animate-fade-in mb-4 sm:mb-6">
 {/* Header Internal Area Chat */}
 <div className="px-4 py-3 border-b border-purple-900/30 bg-[#120D22]/60 flex items-center justify-between">
 <div className="flex items-center gap-2">
 

 </div>
 {activeToolBadge && (
 <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-400/50 text-purple-200 text-[11px] font-mono animate-fade-in">
 <Zap className="w-3 h-3 text-purple-300" />
 <span>Tool Aktif: {activeToolBadge}</span>
 </div>
 )}
 </div>

 {/* 
 ===================================================================
 2. CHAT AREA
 Bubble chat user ungu gelap, AI abu-abu, Avatar AI, Efek berpikir
 ===================================================================
 */}
 <div 
 ref={chatContainerRef}
 onScroll={handleScroll}
 className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
 >
 {messages.map((msg) => {
 const isAi = msg.sender === 'ai';

 return (
 <div
 key={msg.id}
 className={`flex items-start gap-3 sm:gap-4 ${
 isAi ? 'justify-start' : 'justify-end'
 }`}
 >
 {/* Avatar AI Agent (sebelah kiri bubble AI) */}
 {isAi && (
 <div className="flex-shrink-0 relative mt-1">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-700 to-purple-950 border border-purple-400/60 flex items-center justify-center ">
 <Bot className="w-5 h-5 text-purple-200" />
 </div>
 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]" />
 </div>
 )}

 {/* Bubble Chat */}
 <div
 className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
 isAi
 ? 'bg-[#141416]/90 border border-gray-800/80 text-gray-200 backdrop-blur-sm'
 : 'bg-[#1D113A]/90 border border-purple-500/40 text-purple-100 '
 }`}
 >
 {/* Header Kecil Bubble: Nama Sender & Waktu */}
 <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-white/5">
 <span
 className={`text-xs font-semibold font-orbitron tracking-wide ${
 isAi ? 'text-purple-400' : 'text-purple-300'
 }`}
 >
 {isAi ? 'Bara Agent by Bara Official' : 'USER (Cak)'}
 </span>
 <span className="text-[10px] text-gray-400 font-mono">
 {msg.timestamp}
 </span>
 </div>

 {/* Badge Tool jika AI membalas pakai spesifik Tool */}
 {isAi && msg.toolUsed && msg.toolUsed !== 'Umum' && (
 <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 text-[11px] font-mono mb-2">
 <Terminal className="w-3 h-3 text-purple-400" />
 <span>Tool Dipakai: {msg.toolUsed}</span>
 </div>
 )}

 {/* Isi Pesan Chat */}
 <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
 {renderMessageText(msg.text)}
 </div>
 </div>

 {/* Avatar User (sebelah kanan bubble User) */}
 {!isAi && (
 <div className="flex-shrink-0 mt-1">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A1E] border border-purple-500/30 flex items-center justify-center">
 <User className="w-5 h-5 text-purple-300" />
 </div>
 </div>
 )}
 </div>
 );
 })}

 {/* 
 -----------------------------------------------------------------
 SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")
 Tampil ketika isThinking == true
 -----------------------------------------------------------------
 */}
 {isThinking && (
 <div className="flex items-start gap-3 sm:gap-4 justify-start animate-fade-in">
 {/* Avatar AI animasi pulse */}
 <div className="flex-shrink-0 mt-1">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-900/60 border border-purple-400/80 flex items-center justify-center animate-pulse">
 <Sparkles className="w-5 h-5 text-purple-300 animate-spin" style={{ animationDuration: '3s' }} />
 </div>
 </div>

 {/* Bubble "Agent sedang berpikir..." */}
 <div className="bg-[#141416]/90 border border-purple-500/50 rounded-2xl px-5 py-4 flex items-center gap-3">
 {/* Animasi ketik 3 dot */}
 <div className="flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
 <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
 <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
 </div>
 <span className="text-sm font-mono text-purple-300 font-medium tracking-wide">
 Agent sedang berpikir...
 </span>
 </div>
 </div>
 )}

 {/* Elemen jangkar untuk scroll ke bawah */}
 <div ref={chatBottomRef} />
 </div>

 {showScrollButton && (
 <button 
 onClick={() => {
 chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
 setShowScrollButton(false);
 }}
 className="absolute bottom-[130px] sm:bottom-[150px] left-1/2 -translate-x-1/2 p-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white animate-bounce z-50 border border-purple-400 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
 >
 <ArrowDown className="w-5 h-5" />
 </button>
 )}
 {/* 
 ===================================================================
 3. INPUT AREA
 Textarea + Tombol "Kirim Perintah", Placeholder: "Perintahkan aku cak..."
 ===================================================================
 */}
 <div className="p-3 sm:p-4 bg-[#110D1E]/90 border-t border-purple-900/50 backdrop-blur-lg">
 {/* Tombol Prompt Cepat untuk Uji Coba Langsung */}
 <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1">
 <span className="text-[11px] font-mono text-purple-300/70 whitespace-nowrap">
 ⚡ Coba Perintah:
 </span>
 <button
 onClick={() => handleSendCommand('hitung 125 * 8')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-[#18112E] hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
 >
 + Hitung 125 * 8 (Kalkulator)
 </button>
 <button
 onClick={() => handleSendCommand('cari berita terbaru teknologi AI hari ini')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-[#18112E] hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
 >
 + Cari Info AI (Browser)
 </button>
 <button
 onClick={() => handleSendCommand('catat: besok meeting jam 9 pagi')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-[#18112E] hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
 >
 + Catat Jadwal (Catatan)
 </button>
 <button
 onClick={() => handleSendCommand('coba hack server bank sekarang')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
 >
 + Cek Hal Ilegal
 </button>
 </div>

 {/* Kotak Input Textarea & Tombol Kirim */}
 <form
 onSubmit={(e) => {
 e.preventDefault();
 handleSendCommand();
 }}
 className="flex items-center gap-2 sm:gap-3 relative"
 >
 {/* Attachment Button & Menu */}
 <div className="relative shrink-0">
 <input 
 type="file" 
 ref={fileInputRef} 
 onChange={handleFileChange} 
 className="hidden" 
 />
 <button
 type="button"
 onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
 className="h-[52px] sm:h-[58px] w-[52px] sm:w-[58px] flex items-center justify-center rounded-xl bg-[#141416]/90 border border-purple-500/40 text-purple-400 hover:bg-purple-900/40 hover:text-purple-300 transition-all cursor-pointer "
 >
 <Plus className={`w-6 h-6 transition-transform duration-300 ${isAttachmentMenuOpen ? 'rotate-45' : ''}`} />
 </button>

 {isAttachmentMenuOpen && (
 <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#141416]/95 backdrop-blur-xl border border-purple-500/40 rounded-2xl overflow-hidden animate-fade-in p-2 flex flex-col gap-1 z-50">
 <button 
 type="button"
 onClick={handleFileUploadClick}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all cursor-pointer"
 >
 <Upload className="w-4 h-4 text-purple-400" />
 <span>Upload File</span>
 </button>
 <button 
 type="button"
 onClick={() => { setIsAttachmentMenuOpen(false); }}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all cursor-pointer"
 >
 <Github className="w-4 h-4 text-purple-400" />
 <span>Impor Repo Github</span>
 </button>
 <button 
 type="button"
 onClick={() => { setIsAttachmentMenuOpen(false); }}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-purple-300 hover:bg-purple-900/30 rounded-xl transition-all cursor-pointer"
 >
 <Camera className="w-4 h-4 text-purple-400" />
 <span>Kamera</span>
 </button>
 </div>
 )}
 </div>
 <div className="flex-1 relative">
 <textarea
 value={inputCommand}
 onChange={(e) => setInputCommand(e.target.value)}
 onKeyDown={(e) => {
 // Enter tanpa Shift = Kirim pesan
 if (e.key === 'Enter' && !e.shiftKey) {
 e.preventDefault();
 handleSendCommand();
 }
 }}
 disabled={isThinking}
 placeholder="Perintahkan aku cak..."
 rows={1}
 className="w-full h-[52px] sm:h-[58px] bg-[#0A0A0E] border border-purple-500/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-xl pl-4 pr-4 sm:pr-24 py-3 sm:py-4 text-sm sm:text-base text-gray-100 placeholder-purple-400/50 resize-none transition-all disabled:opacity-60"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono hidden sm:block">
 Enter ↵ untuk kirim
 </div>
 </div>

 {/* Tombol "Kirim Perintah" warna ungu neon glow */}
 <button
 type="submit"
 disabled={!inputCommand.trim() || isThinking}
 className="h-[52px] sm:h-[58px] px-5 sm:px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-orbitron text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer hover: active:scale-95 disabled:cursor-not-allowed disabled: shrink-0"
 >
 <Send className="w-4 h-4" />
 <span className="hidden sm:inline">Kirim Perintah</span>
 </button>
 </form>
 </div>
 </section>
 )}

 {/* SIDEBAR TABS */}
 {activeTab === 'prompt' && (
 <div className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 backdrop-blur-md animate-fade-in flex-1 overflow-y-auto">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <Terminal className="w-4 h-4 text-purple-400" />
 <h2 className="font-orbitron text-sm font-bold tracking-wide text-purple-300 uppercase">
 System Prompt
 </h2>
 </div>
 <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700/40">
 Kepribadian AI
 </span>
 </div>

 <p className="text-xs text-gray-400 mb-2 font-mono">
 Atur kepribadian & aturan bertindak untuk BARA AGENT:
 </p>

 {/* Textarea untuk mengedit System Prompt */}
 <textarea
 value={systemPrompt}
 onChange={(e) => setSystemPrompt(e.target.value)}
 rows={4}
 className="w-full bg-[#0A0A0C] border border-purple-500/30 focus:border-purple-400 rounded-xl p-3 text-xs sm:text-sm text-gray-200 font-mono focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-y transition-all leading-relaxed mb-3"
 />

 {/* Tombol Save & Indikator Sukses */}
 <div className="flex items-center justify-between gap-2">
 <button
 onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
 title="Kembalikan ke prompt default"
 className="text-xs font-mono text-gray-400 hover:text-purple-300 transition-colors cursor-pointer underline underline-offset-4"
 >
 Reset ke Default
 </button>

 <button
 onClick={handleSavePrompt}
 className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-orbitron text-xs font-semibold flex items-center gap-1.5 transition-all hover: cursor-pointer active:scale-95"
 >
 {isPromptSavedToast ? (
 <>
 <Check className="w-3.5 h-3.5 text-emerald-300" />
 <span>Tersimpan!</span>
 </>
 ) : (
 <>
 <Save className="w-3.5 h-3.5" />
 <span>Save Prompt</span>
 </>
 )}
 </button>
 </div>
 </div>
 )}

 {activeTab === 'tools' && (
 <div className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 backdrop-blur-md animate-fade-in flex-1 overflow-y-auto">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <Wrench className="w-4 h-4 text-purple-400" />
 <h2 className="font-orbitron text-sm font-bold tracking-wide text-purple-300 uppercase">
 Tools Agent
 </h2>
 </div>
 <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-600/40">
 12 Tools Siap
 </span>
 </div>

 <p className="text-xs text-gray-400 mb-3 font-mono">
 Daftar kapabilitas otonom yang bisa dieksekusi oleh BARA AGENT:
 </p>

 {/* List Tools: [Browser, Kalkulator, Catatan, Code Execution, Function Calling, Multimodal] */}
 <div className="space-y-2.5">
 {AGENT_TOOLS.map((tool) => {
 const IconComp = tool.icon;
 const isRecentlyUsed = activeToolBadge === tool.id;

 return (
 <div
 key={tool.id}
 className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
 isRecentlyUsed
 ? 'bg-purple-950/70 border-purple-400 '
 : 'bg-[#131317] border-purple-900/40 hover:border-purple-500/40'
 }`}
 >
 <div
 className={`p-2 rounded-lg ${
 isRecentlyUsed
 ? 'bg-purple-600 text-white'
 : 'bg-[#1C1530] text-purple-300'
 }`}
 >
 <IconComp className="w-4 h-4" />
 </div>

 <div className="flex-1 min-w-0">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-bold font-orbitron text-purple-200">
 {tool.name}
 </h3>
 <span
 className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
 isRecentlyUsed
 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
 : 'bg-purple-950 text-purple-400'
 }`}
 >
 {isRecentlyUsed ? 'Aktif Dipakai' : 'Siap Pakai'}
 </span>
 </div>
 <p className="text-[11px] text-gray-400 mt-1 leading-snug">
 {tool.description}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 )}

 {activeTab === 'history' && (
 <div className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-4 sm:p-5 backdrop-blur-md flex-1 flex flex-col animate-fade-in overflow-hidden">
 <div className="flex items-center justify-between mb-3">
 <div className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-purple-400" />
 <h2 className="font-orbitron text-sm font-bold tracking-wide text-purple-300 uppercase">
 Riwayat Tugas
 </h2>
 </div>
 {taskHistory.length > 0 && (
 <button
 onClick={handleClearTaskHistory}
 title="Hapus riwayat tugas"
 className="text-[11px] font-mono text-gray-400 hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
 >
 <Trash2 className="w-3 h-3" />
 <span>Hapus</span>
 </button>
 )}
 </div>

 <p className="text-xs text-gray-400 mb-3 font-mono">
 Daftar perintah yang telah selesai dieksekusi oleh Agent:
 </p>

 {/* Daftar Riwayat Tugas */}
 <div className="space-y-2.5 overflow-y-auto max-h-[240px] pr-1">
 {taskHistory.length === 0 ? (
 <div className="text-center py-8 border border-dashed border-purple-900/40 rounded-xl bg-[#111115]/50">
 <Clock className="w-6 h-6 text-purple-500/40 mx-auto mb-2" />
 <p className="text-xs text-gray-500 font-mono">
 Belum ada tugas yang dikerjakan cak.
 </p>
 </div>
 ) : (
 taskHistory.map((task) => {
 const isSuccess = task.status === 'Selesai';

 return (
 <div
 key={task.id}
 className="p-3 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all space-y-1.5"
 >
 <div className="flex items-center justify-between gap-2">
 <div className="flex items-center gap-1.5">
 {isSuccess ? (
 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
 ) : (
 <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
 )}
 <span
 className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
 isSuccess
 ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-600/30'
 : 'bg-red-950/70 text-red-300 border border-red-600/30'
 }`}
 >
 {task.status}
 </span>
 </div>
 <span className="text-[10px] text-gray-500 font-mono">
 {task.timestamp}
 </span>
 </div>

 <div className="text-xs font-medium text-gray-200 line-clamp-2">
 "{task.command}"
 </div>

 <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-1 border-t border-white/5">
 <span className="text-purple-400">Tool: {task.toolUsed}</span>
 <span className="truncate max-w-[140px] text-gray-400">
 {task.responseSummary}
 </span>
 </div>
 </div>
 );
 })
 )}
 </div>
 </div>
 )}

 {activeTab === 'account' && (
 <section className="bg-[#0E0E12]/90 border border-purple-900/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md animate-fade-in flex-1 overflow-y-auto">
 <div className="flex items-center gap-4 mb-6 pb-4 border-b border-purple-900/30">
 <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 border border-purple-400/50 flex items-center justify-center ">
 <UserCircle className="w-8 h-8 text-purple-100" />
 </div>
 <div>
 <h2 className="font-orbitron text-xl font-bold tracking-wide text-purple-100 uppercase">
 Akun User
 </h2>
 <div className="flex items-center gap-1.5 mt-1">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 glow-green-sm"></span>
 </span>
 <p className="text-xs text-emerald-400 font-mono tracking-wide">Status: Terverifikasi</p>
 </div>
 </div>
 </div>
 
 <div className="space-y-3">
 <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
 <div className="flex items-center gap-3 flex-1">
 <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg shrink-0">
 <User className="w-5 h-5 text-purple-300" />
 </div>
 <div className="flex-1">
 <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Username</p>
 {isEditingUserName ? (
 <div className="flex items-center gap-2">
 <input
 type="text"
 value={tempUserName}
 onChange={(e) => setTempUserName(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === 'Enter') {
 setUserName(tempUserName || 'Cak Bara');
 setIsEditingUserName(false);
 }
 }}
 autoFocus
 className="w-full bg-[#0A0A0E] border border-purple-500/40 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 text-sm text-gray-100"
 />
 <button
 onClick={() => {
 setUserName(tempUserName || 'Cak Bara');
 setIsEditingUserName(false);
 }}
 className="p-1 rounded bg-purple-600/50 hover:bg-purple-500 text-white transition-all cursor-pointer"
 >
 <CheckIcon className="w-3.5 h-3.5" />
 </button>
 </div>
 ) : (
 <div className="flex items-center justify-between gap-2">
 <p className="text-sm font-bold text-gray-200">{userName}</p>
 <button
 onClick={() => {
 setTempUserName(userName);
 setIsEditingUserName(true);
 }}
 className="text-gray-500 hover:text-purple-300 transition-colors p-1 cursor-pointer"
 >
 <Edit2 className="w-3.5 h-3.5" />
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">
 <Download className="w-5 h-5 text-purple-300" />
 </div>
 <div>
 <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Source Code</p>
 <a href="/bara-agent-source.zip" download="bara-agent-source.zip" className="text-sm font-bold text-blue-400 hover:text-blue-300 underline cursor-pointer">
 Download Full Source Code (.zip)
 </a>
 </div>
 </div>
 </div>
 <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">
 <ShieldAlert className="w-5 h-5 text-purple-300" />
 </div>
 <div>
 <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Security Level</p>
 <p className="text-sm font-bold text-emerald-400">Maximum (Level 9)</p>
 </div>
 </div>
 </div>
 <div className="p-4 rounded-xl bg-[#131317] border border-purple-900/40 hover:border-purple-500/40 transition-all flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2.5 bg-purple-900/30 border border-purple-500/20 rounded-lg">
 <Activity className="w-5 h-5 text-purple-300" />
 </div>
 <div>
 <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-0.5">Uptime Session</p>
 <p className="text-sm font-bold text-purple-200">24h 0m</p>
 </div>
 </div>
 </div>
 </div>
 </section>
 )}
 </main>

 {/* 
 =======================================================================
 BOTTOM NAVIGATION
 =======================================================================
 */}
 <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 border-t border-purple-900/50 backdrop-blur-lg z-50 pb-safe">
 <div className="max-w-3xl mx-auto px-2 py-1.5 flex items-center justify-between">
 {[
 { id: 'chat', label: 'Chat', icon: MessageSquare },
 { id: 'prompt', label: 'Prompt', icon: Terminal },
 { id: 'tools', label: 'Tools', icon: Wrench },
 { id: 'history', label: 'Riwayat', icon: History },
 { id: 'account', label: 'Akun', icon: UserCircle },
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as TabType)}
 className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
 isActive ? 'text-purple-400' : 'text-gray-500 hover:text-purple-300'
 }`}
 >
 <div className={`p-1.5 rounded-full transition-all ${
 isActive ? 'bg-purple-900/40 ' : 'bg-transparent'
 }`}>
 <Icon className={`w-5 h-5 ${isActive ? 'glow-purple-sm' : ''}`} />
 </div>
 <span className={`text-[10px] font-mono tracking-wider ${isActive ? 'font-bold' : ''}`}>
 {tab.label}
 </span>
 </button>
 );
 })}
 </div>
 </nav>
 </div>
 );
}

