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

import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

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
, ArrowDown, Rocket, Download, Edit2, Copy, ThumbsUp, ThumbsDown, FileCode, Eye, Check as CheckIcon} from 'lucide-react';

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
 <div className="my-4 rounded-xl border border-primary-500/40 bg-[#0A0A0C] overflow-hidden w-full max-w-full">
 <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416]/90 border-b border-primary-500/30">
 <div className="flex items-center gap-2">
 <FileCode className="w-4 h-4 text-primary-400" />
 <span className="text-xs font-mono text-primary-300 uppercase tracking-wider">{language || 'text'}</span>
 </div>
 <div className="flex gap-2">
 <button 
 type="button"
 onClick={() => setShowFull(!showFull)}
 className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-xs font-medium cursor-pointer"
 >
 <Eye className="w-3.5 h-3.5" />
 {showFull ? 'Tutup' : 'Lihat Code'}
 </button>
 <button 
 type="button"
 onClick={handleCopy}
 className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-xs font-medium cursor-pointer"
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
 className="text-primary-400 hover:text-primary-300 underline underline-offset-2 transition-colors font-medium"
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
 return <strong key={bIndex} className="font-bold text-primary-200">{bMatch[1]}</strong>;
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
 

  // --- STATE THEME & MODALS ---
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('bara_theme') || 'purple';
  });
  useEffect(() => {
    localStorage.setItem('bara_theme', theme);
  }, [theme]);

  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  // --- STATE GOOGLE LOGIN ---
  const [googleUser, setGoogleUser] = useState<any>(() => {
    const saved = localStorage.getItem('bara_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleGoogleSuccess = (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode(credentialResponse.credential);
      setGoogleUser(decoded);
      localStorage.setItem('bara_google_user', JSON.stringify(decoded));
      setMessages(prev => [...prev, {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `Login berhasil cak! Selamat datang ${(decoded as any).name}.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        toolUsed: 'Sistem'
      }]);
    }
  };

  const handleGoogleLogout = () => {
    googleLogout();
    setGoogleUser(null);
    localStorage.removeItem('bara_google_user');
  };

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
 <div className={`min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-primary-600 selection:text-white theme-${theme}`}>
 {/* 
 =======================================================================
 1. HEADER APLIKASI
 Logo "BARA AGENT" warna ungu dengan efek glow & status "Agent: Online"
 =======================================================================
 */}
       <header className="border-b border-primary-900/50 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsToolsMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl bg-primary-900/20 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-xl blur-md opacity-75 animate-pulse" />
                <div className="relative bg-[#140F2A] border border-primary-500/50 p-2.5 rounded-xl ">
                  <Wrench className="w-6 h-6 text-primary-400" />
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-wider text-primary-400 font-orbitron glow-primary-text">
                  Bara Agent
                </h1>
                <p className="text-[10px] text-primary-300/70 font-mono hidden sm:block">
                  [AUTONOMOUS AI SYSTEM]
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#130E24] border border-primary-500/40 ">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 glow-green-sm"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-emerald-400 tracking-wide font-mono">
                Agent: Online
              </span>
            </div>
            
            <button 
              onClick={() => setIsSettingsMenuOpen(true)}
              className="p-2 rounded-xl bg-primary-900/20 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
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
 <section className="flex flex-col flex-1 bg-[#0E0E12]/90 border border-primary-900/50 rounded-3xl overflow-hidden backdrop-blur-xl relative animate-fade-in mb-4 sm:mb-6">
 {/* Header Internal Area Chat */}
 <div className="px-4 py-3 border-b border-primary-900/30 bg-[#120D22]/60 flex items-center justify-between">
 <div className="flex items-center gap-2">
 

 </div>
 {activeToolBadge && (
 <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary-900/60 border border-primary-400/50 text-primary-200 text-[11px] font-mono animate-fade-in">
 <Zap className="w-3 h-3 text-primary-300" />
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
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary-700 to-primary-950 border border-primary-400/60 flex items-center justify-center ">
 <Bot className="w-5 h-5 text-primary-200" />
 </div>
 <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]" />
 </div>
 )}

 {/* Bubble Chat */}
 <div
 className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
 isAi
 ? 'bg-[#141416]/90 border border-gray-800/80 text-gray-200 backdrop-blur-sm'
 : 'bg-[#1D113A]/90 border border-primary-500/40 text-primary-100 '
 }`}
 >
 {/* Header Kecil Bubble: Nama Sender & Waktu */}
 <div className="flex items-center justify-between gap-4 mb-1.5 pb-1 border-b border-white/5">
 <span
 className={`text-xs font-semibold font-orbitron tracking-wide ${
 isAi ? 'text-primary-400' : 'text-primary-300'
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
 <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-950/80 border border-primary-500/30 text-primary-300 text-[11px] font-mono mb-2">
 <Terminal className="w-3 h-3 text-primary-400" />
 <span>Tool Dipakai: {msg.toolUsed}</span>
 </div>
 )}

               {/* Isi Pesan Chat */}
              <div className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                {renderMessageText(msg.text)}
              </div>
              
              {/* ACTION BAR (IKON COPY, THUMBS UP, THUMBS DOWN) */}
              {isAi && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-gray-500">
                  <button onClick={() => navigator.clipboard.writeText(msg.text)} className="p-1.5 hover:bg-white/5 rounded-lg hover:text-primary-300 transition-all cursor-pointer" title="Salin pesan">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-white/5 rounded-lg hover:text-primary-300 transition-all cursor-pointer" title="Jawaban bagus">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 hover:bg-white/5 rounded-lg hover:text-primary-300 transition-all cursor-pointer" title="Jawaban buruk">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

 {/* Avatar User (sebelah kanan bubble User) */}
 {!isAi && (
 <div className="flex-shrink-0 mt-1">
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A1E] border border-primary-500/30 flex items-center justify-center">
 <User className="w-5 h-5 text-primary-300" />
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
 <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-900/60 border border-primary-400/80 flex items-center justify-center animate-pulse">
 <Sparkles className="w-5 h-5 text-primary-300 animate-spin" style={{ animationDuration: '3s' }} />
 </div>
 </div>

 {/* Bubble "Agent sedang berpikir..." */}
 <div className="bg-[#141416]/90 border border-primary-500/50 rounded-2xl px-5 py-4 flex items-center gap-3">
 {/* Animasi ketik 3 dot */}
 <div className="flex items-center gap-1.5">
 <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }} />
 <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '150ms' }} />
 <span className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '300ms' }} />
 </div>
 
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
 className="absolute bottom-[130px] sm:bottom-[150px] left-1/2 -translate-x-1/2 p-3 rounded-full bg-primary-600 hover:bg-primary-500 text-white animate-bounce z-50 border border-primary-400 backdrop-blur-md transition-all flex items-center justify-center cursor-pointer"
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
 <div className="p-3 sm:p-4 bg-[#110D1E]/90 border-t border-primary-900/50 backdrop-blur-lg">
 {/* Tombol Prompt Cepat untuk Uji Coba Langsung */}
 <div className="flex items-center gap-2 mb-2.5 overflow-x-auto pb-1">
 <span className="text-[11px] font-mono text-primary-300/70 whitespace-nowrap">
 ⚡ Coba Perintah:
 </span>
 <button
 onClick={() => handleSendCommand('hitung 125 * 8')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-[#18112E] hover:bg-primary-900/60 border border-primary-500/30 text-primary-200 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
 >
 + Hitung 125 * 8 (Kalkulator)
 </button>
 <button
 onClick={() => handleSendCommand('cari berita terbaru teknologi AI hari ini')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-[#18112E] hover:bg-primary-900/60 border border-primary-500/30 text-primary-200 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
 >
 + Cari Info AI (Browser)
 </button>
 <button
 onClick={() => handleSendCommand('catat: besok meeting jam 9 pagi')}
 disabled={isThinking}
 className="px-2.5 py-1 rounded-full bg-[#18112E] hover:bg-primary-900/60 border border-primary-500/30 text-primary-200 text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
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
 className="h-[52px] sm:h-[58px] w-[52px] sm:w-[58px] flex items-center justify-center rounded-xl bg-[#141416]/90 border border-primary-500/40 text-primary-400 hover:bg-primary-900/40 hover:text-primary-300 transition-all cursor-pointer "
 >
 <Plus className={`w-6 h-6 transition-transform duration-300 ${isAttachmentMenuOpen ? 'rotate-45' : ''}`} />
 </button>

 {isAttachmentMenuOpen && (
 <div className="absolute bottom-full left-0 mb-3 w-48 bg-[#141416]/95 backdrop-blur-xl border border-primary-500/40 rounded-2xl overflow-hidden animate-fade-in p-2 flex flex-col gap-1 z-50">
 <button 
 type="button"
 onClick={handleFileUploadClick}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
 >
 <Upload className="w-4 h-4 text-primary-400" />
 <span>Upload File</span>
 </button>
 <button 
 type="button"
 onClick={() => { setIsAttachmentMenuOpen(false); }}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
 >
 <Github className="w-4 h-4 text-primary-400" />
 <span>Impor Repo Github</span>
 </button>
 <button 
 type="button"
 onClick={() => { setIsAttachmentMenuOpen(false); }}
 className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
 >
 <Camera className="w-4 h-4 text-primary-400" />
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
 className="w-full h-[52px] sm:h-[58px] bg-[#0A0A0E] border border-primary-500/40 focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-500 rounded-xl pl-4 pr-4 sm:pr-24 py-3 sm:py-4 text-sm sm:text-base text-gray-100 placeholder-primary-400/50 resize-none transition-all disabled:opacity-60"
 />
 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-mono hidden sm:block">
 Enter ↵ untuk kirim
 </div>
 </div>

 {/* Tombol "Kirim Perintah" warna ungu neon glow */}
 <button
 type="submit"
 disabled={!inputCommand.trim() || isThinking}
 className="h-[52px] sm:h-[58px] px-5 sm:px-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-orbitron text-xs sm:text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer hover: active:scale-95 disabled:cursor-not-allowed disabled: shrink-0"
 >
 <Send className="w-4 h-4" />
 <span className="hidden sm:inline">Kirim Perintah</span>
 </button>
 </form>
 </div>
 </section>
 )}

 {/* SIDEBAR TABS */}
 
 </main>

 {/* 
 =======================================================================
 BOTTOM NAVIGATION
 =======================================================================
 */}
 
      {/* Settings Modal (Gear Icon) */}
      {isSettingsMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-primary-900/30 shrink-0">
              <h2 className="text-lg font-orbitron font-bold text-primary-400">Settings</h2>
              <button onClick={() => setIsSettingsMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex flex-col gap-6">
              {/* Google Login */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Akun Google</h3>
                {googleUser ? (
                  <div className="flex items-center justify-between p-3 bg-primary-900/10 border border-primary-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={googleUser.picture} alt="Profile" className="w-10 h-10 rounded-full border border-primary-500" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-semibold text-sm">{googleUser.name}</p>
                        <p className="text-xs text-gray-400">{googleUser.email}</p>
                      </div>
                    </div>
                    <button onClick={handleGoogleLogout} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer" title="Logout">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </button>
                  </div>
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => console.log('Login Failed')}
                    shape="pill"
                    size="medium"
                    theme="filled_black"
                  />
                )}
              </div>

              {/* Edit Username */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Username Panggilan</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={isEditingUserName ? tempUserName : userName}
                    onChange={(e) => setTempUserName(e.target.value)}
                    disabled={!isEditingUserName}
                    className="flex-1 bg-primary-900/10 border border-primary-500/30 rounded-xl px-3 py-2 text-sm text-gray-200 disabled:opacity-50"
                  />
                  {isEditingUserName ? (
                    <button onClick={() => { setUserName(tempUserName); setIsEditingUserName(false); }} className="p-2 bg-primary-600 rounded-xl text-white cursor-pointer"><CheckCircle2 className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={() => { setTempUserName(userName); setIsEditingUserName(true); }} className="p-2 bg-primary-900/30 text-primary-400 rounded-xl cursor-pointer"><Wrench className="w-4 h-4" /></button>
                  )}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">Tema Aplikasi</h3>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'purple', name: 'Purple', bg: 'bg-purple-500' },
                    { id: 'green', name: 'Green', bg: 'bg-emerald-500' },
                    { id: 'blue', name: 'Blue', bg: 'bg-blue-500' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex-1 py-2 flex flex-col items-center gap-2 border rounded-xl transition-all cursor-pointer ${theme === t.id ? 'border-primary-400 bg-primary-900/20' : 'border-gray-800 bg-transparent hover:border-gray-600'}`}
                    >
                      <div className={`w-4 h-4 rounded-full ${t.bg}`}></div>
                      <span className="text-xs">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-mono text-primary-300 uppercase">System Prompt</h3>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-primary-900/10 border border-primary-500/30 rounded-xl px-3 py-2 text-xs text-gray-300 min-h-[120px]"
                />
                <div className="flex justify-end">
                   <button onClick={() => {
                     localStorage.setItem('bara_system_prompt', systemPrompt);
                     setIsPromptSavedToast(true);
                     setTimeout(() => setIsPromptSavedToast(false), 3000);
                   }} className="text-xs bg-primary-600 px-3 py-1.5 rounded-lg text-white font-medium flex items-center gap-1 cursor-pointer">
                     <Save className="w-3 h-3" /> Simpan Prompt
                   </button>
                </div>
                {isPromptSavedToast && <p className="text-emerald-400 text-xs text-right mt-1">✓ Berhasil disimpan</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools Modal (Hamburger Menu) */}
      {isToolsMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-start bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0E0E12]/95 border border-primary-900/50 rounded-2xl w-full max-w-sm overflow-hidden animate-fade-in flex flex-col max-h-full">
            <div className="flex items-center justify-between p-4 border-b border-primary-900/30 shrink-0">
              <h2 className="text-lg font-orbitron font-bold text-primary-400">Tools Bara Agent</h2>
              <button onClick={() => setIsToolsMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex flex-col gap-3">
              <p className="text-sm text-gray-400 mb-2">Pilih tool untuk digunakan agent dalam merespons instruksi selanjutnya.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'Umum', icon: Globe, desc: 'Percakapan AI Umum' },
                  { id: 'Browser', icon: Globe, desc: 'Pencarian Internet' },
                  { id: 'Kalkulator', icon: Calculator, desc: 'Hitung Matematika' },
                  { id: 'Sistem', icon: Terminal, desc: 'Operasi Sistem' },
                  { id: 'Deploy Tools', icon: Activity, desc: 'Github & Deploy' },
                  { id: 'Error', icon: Wrench, desc: 'Troubleshooting' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveToolBadge(t.id);
                      setIsToolsMenuOpen(false);
                    }}
                    className={`p-3 rounded-xl border flex flex-col gap-2 items-start transition-all cursor-pointer ${
                      activeToolBadge === t.id 
                        ? 'bg-primary-900/40 border-primary-500' 
                        : 'bg-primary-900/10 border-primary-900/30 hover:border-primary-500/50 hover:bg-primary-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <t.icon className={`w-4 h-4 ${activeToolBadge === t.id ? 'text-primary-300' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${activeToolBadge === t.id ? 'text-primary-300' : 'text-gray-300'}`}>{t.id}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

<nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A]/95 border-t border-primary-900/50 backdrop-blur-lg z-50 pb-safe">
 <div className="max-w-3xl mx-auto px-2 py-1.5 flex items-center justify-between">
 {[
 { id: 'chat', label: 'Chat', icon: MessageSquare },
 
 
 { id: 'history', label: 'Riwayat', icon: History },
 
 ].map((tab) => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as TabType)}
 className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1 ${
 isActive ? 'text-primary-400' : 'text-gray-500 hover:text-primary-300'
 }`}
 >
 <div className={`p-1.5 rounded-full transition-all ${
 isActive ? 'bg-primary-900/40 ' : 'bg-transparent'
 }`}>
 <Icon className={`w-5 h-5 ${isActive ? 'glow-primary-sm' : ''}`} />
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

