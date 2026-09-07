/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ============================================================================
 * APLIKASI WEB: BARA AI
 * TEMA: Hitam #0A0A0A dan Ungu #8B5CF6 (Futuristik, Dark, Glassmorphism)
 * FONT: Orbitron & JetBrains Mono
 * ============================================================================
 */


import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { io, Socket } from 'socket.io-client';

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
 UserCircle, Users, Image as ImageIcon2, Folder, Star, Pin, LogOut, Pencil,
 Plus,
 Upload,
 Camera
, Menu, Reply, X, ArrowDown, Rocket, Download, Edit2, Copy, ThumbsUp, ThumbsDown, FileCode, Eye, Check as CheckIcon, MoreVertical } from 'lucide-react';

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
 "Kamu adalah BARA AI. Asisten AI pribadi yg cerdas dan proaktif. \n" +
 "Tugas: Bantu user menyelesaikan tugas. Gaya bahasa: Santai, panggil user 'cak'. \n" +
 "Aturan: Jangan lakukan hal ilegal. Jika tidak bisa, jelaskan kenapa.";

/** Kunci penyimpanan lokal (localStorage) */
const STORAGE_KEY_PROMPT = 'bara_ai_system_prompt';
const STORAGE_KEY_CHAT = 'bara_ai_chat_history';
const STORAGE_KEY_TASKS = 'bara_ai_task_history';
const STORAGE_KEY_NOTES = 'bara_ai_saved_notes';
const STORAGE_KEY_USERNAME = 'bara_ai_username';

/** Daftar Tools yang tersedia untuk BARA AI */
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
  let language = match && match[1] ? match[1] : 'text';
  const code = (match ? match[2] : content.replace(/```/g, '')).trim();
  
  // Determine if this is a prompt
  const isPrompt = language.toLowerCase() === 'prompt' || (language.toLowerCase() === 'text' && code.toLowerCase().includes('prompt:'));
  if (isPrompt) language = 'prompt';
  const typeText = isPrompt ? 'Prompt' : 'Code';
  const title = isPrompt ? 'PROMPT' : language.toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderCode = (isModal = false) => (
    <SyntaxHighlighter
      language={language.toLowerCase() === 'prompt' ? 'text' : language.toLowerCase()}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '1.25rem',
        background: '#0A0A0C',
        fontSize: 'inherit',
        height: isModal ? '100%' : 'auto',
      }}
      wrapLongLines={false}
    >
      {code}
    </SyntaxHighlighter>
  );

  return (
    <>
      <div className="my-4 rounded-xl border border-primary-500/40 bg-[#0A0A0C] overflow-hidden w-full max-w-full shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#141416]/90 border-b border-primary-500/30">
          <div className="flex items-center gap-2">
            {isPrompt ? <MessageSquare className="w-4 h-4 text-primary-400" /> : <FileCode className="w-4 h-4 text-primary-400" />}
            <span className="text-xs font-mono text-primary-300 tracking-wider font-semibold uppercase">{title}</span>
          </div>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={() => setShowFull(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-[10px] sm:text-xs font-mono font-medium cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat {typeText}
            </button>
            <button 
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-[10px] sm:text-xs font-mono font-medium cursor-pointer"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Tersalin' : `Salin ${typeText}`}
            </button>
          </div>
        </div>
        <div className="relative text-[13px] sm:text-sm font-mono leading-relaxed text-left max-h-64 overflow-hidden">
          {renderCode()}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A0C] to-transparent pointer-events-none" />
        </div>
      </div>

      {showFull && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-fade-in">
          <div className="bg-[#0A0A0C] w-full max-w-5xl max-h-full rounded-2xl border border-primary-500/40 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#141416]/90 border-b border-primary-500/30 shrink-0">
              <div className="flex items-center gap-2">
                {isPrompt ? <MessageSquare className="w-5 h-5 text-primary-400" /> : <FileCode className="w-5 h-5 text-primary-400" />}
                <span className="text-sm font-mono text-primary-300 tracking-wider font-semibold uppercase">{title}</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-300 transition-colors text-xs font-mono font-medium cursor-pointer"
                >
                  {copied ? <CheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Tersalin' : `Salin ${typeText}`}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowFull(false)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto text-[13px] sm:text-sm font-mono leading-relaxed text-left">
              {renderCode(true)}
            </div>
          </div>
        </div>
      )}
    </>
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
    const root = document.documentElement;
    root.classList.remove('theme-blue', 'theme-green'); // purple is default in :root
    if (theme === 'blue') root.classList.add('theme-blue');
    if (theme === 'green') root.classList.add('theme-green');
  }, [theme]);

  
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);

  const handleSaveChatFile = () => {
    if (messages.length === 0) return;
    
    let chatContent = "# Bara AI - Chat History\n\n";
    messages.forEach(msg => {
      const senderName = msg.sender === 'user' ? (userName || 'User (Cak)') : 'Bara AI';
      chatContent += `[${msg.timestamp}] ${senderName}:\n${msg.text}\n\n`;
    });
    
    const blob = new Blob([chatContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bara_AI_Chat_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsTopMenuOpen(false);
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
 const handleFeedback = (id: string, type: 'up' | 'down') => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, feedback: msg.feedback === type ? undefined : type } : msg
    ));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
 text: 'Halo cak! Aku BARA AI, asisten AI futuristikmu yang aktif 24/7. Ada tugas atau perintah apa yang bisa kubantu hari ini cak?',
 timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
 toolUsed: 'Umum'
 }
 ];
 });

 
  // --- STATE ROOM CHAT ---
  const [chatMode, setChatMode] = useState<'ai' | 'room'>('ai');
  const [roomMessages, setRoomMessages] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // --- UI STATE POPUPS ---
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // --- ROOM CHAT INTERACTION STATE ---
  const [selectedRoomMessage, setSelectedRoomMessage] = useState<any>(null);
  const [editingRoomMessageId, setEditingRoomMessageId] = useState<string | null>(null);
  
  const handleRoomMessageAction = (action: 'delete' | 'star' | 'pin') => {
    if (!selectedRoomMessage) return;
    
    // Simulate updating local state for star/pin
    if (action === 'delete') {
       setRoomMessages(prev => prev.filter(m => m.id !== selectedRoomMessage.id));
    } else {
       setRoomMessages(prev => prev.map(m => m.id === selectedRoomMessage.id ? { ...m, [action]: !m[action] } : m));
    }
    setSelectedRoomMessage(null);
  };

  // --- ROOM CHAT SPECIFIC STATES ---
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [roomWallpaper, setRoomWallpaper] = useState<string | null>(null);
  const [roomWallpaperType, setRoomWallpaperType] = useState<'image' | 'video' | null>(null);
  const [isRoomSettingsOpen, setIsRoomSettingsOpen] = useState(false);
  const [isStarredMessagesOpen, setIsStarredMessagesOpen] = useState(false);
  const wallpaperInputRef = useRef<HTMLInputElement>(null);

  const handleWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = function() {
          if (video.duration > 21) { // 21 to give a 1s buffer for 20s videos
            alert("Durasi video maksimal 20 detik cak!");
            URL.revokeObjectURL(video.src);
            return;
          }
          setRoomWallpaperType(type);
          setRoomWallpaper(video.src); // Gunakan object URL agar ringan dan cepat
        }
        video.src = URL.createObjectURL(file);
      } else {
        setRoomWallpaperType(type);
        const imgUrl = URL.createObjectURL(file);
        setRoomWallpaper(imgUrl);
      }
    }
  };

  
  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    
    newSocket.on("room_message", (msg) => {
      setRoomMessages(prev => [...prev, msg]);
    });
    
    newSocket.on("update_room_message", (updatedMsg) => {
      setRoomMessages(prev => prev.map(m => m.id === updatedMsg.id ? { ...m, text: updatedMsg.text, isEdited: true } : m));
    });
    
    return () => {
      newSocket.close();
    };
  }, []);

  const handleSendRoomMessage = (text: string, file?: any) => {
    if (!text.trim() && !file) return;
    
    if (editingRoomMessageId) {
      setRoomMessages(prev => prev.map(msg => 
        msg.id === editingRoomMessageId ? { ...msg, text: text, isEdited: true } : msg
      ));
      socket?.emit("update_room_message", { id: editingRoomMessageId, text: text });
      setEditingRoomMessageId(null);
      return;
    }
    
    const newMsg = {
      id: `room-${Date.now()}`,
      sender: 'user',
      senderName: userName || 'Anonim',
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      file: file ? { name: file.name } : null,
      replyTo: replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text } : null
    };
    
    setRoomMessages(prev => [...prev, newMsg]);
    socket?.emit("room_message", { ...newMsg, isMe: false });
    setReplyingTo(null);
  };
  
  // --- STATE BOTTOM NAV ---
 
 

 // --- STATE INPUT PERINTAH ---
 const [inputCommand, setInputCommand] = useState<string>('');
 const [isThinking, setIsThinking] = useState<boolean>(false);
 
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
 text: 'Riwayat chat telah dibersihkan cak! BARA AI siap menerima perintah baru.',
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
        {chatMode === 'room' && roomWallpaper && (
          <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
            {roomWallpaperType === 'video' ? (
              <video autoPlay loop muted playsInline src={roomWallpaper} className="w-full h-full object-cover" />
            ) : (
              <img src={roomWallpaper} alt="Room Wallpaper" className="w-full h-full object-cover" />
            )}
          </div>
        )}
 {/* 
 =======================================================================
 1. HEADER APLIKASI
 Logo "BARA AI" warna ungu dengan efek glow & status "Agent: Online"
 =======================================================================
 */}
             <header className="relative z-10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-transparent">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="relative w-12 h-12 flex items-center justify-start">
            <button 
              onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
            >
              <div className="flex flex-col gap-1 items-center justify-center w-4 h-4">
                <span className={`block h-[1.5px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? 'rotate-45 translate-y-[5.5px]' : ''}`}></span>
                <span className={`block h-[1.5px] w-full bg-current transition duration-300 ease-in-out ${isTopMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-[1.5px] w-full bg-current transform transition duration-300 ease-in-out ${isTopMenuOpen ? '-rotate-45 -translate-y-[5.5px]' : ''}`}></span>
              </div>
            </button>

            {isTopMenuOpen && (
              <>
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsTopMenuOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 w-72 bg-[#09090b] border-r border-primary-500/30 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
                  <div className="p-4 border-b border-primary-900/30 flex items-center justify-between">
                    <h2 className="text-lg font-orbitron font-bold text-primary-400">Riwayat Chat</h2>
                    <button onClick={() => setIsTopMenuOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                  
                  <div className="p-4 flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        setChatMode('room');
                        setIsTopMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-primary-900/30 border border-primary-500/30 flex items-center gap-3 transition-colors cursor-pointer font-medium ${chatMode === 'room' ? 'bg-primary-900/40 text-primary-300' : 'bg-[#1A1A24] text-white'}`}
                    >
                      <Users className="w-5 h-5 text-primary-400" />
                      Room Chat
                    </button>

                    <button 
                      onClick={() => {
                        setChatMode('ai');
                        setIsTopMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl hover:bg-primary-900/30 border border-primary-500/30 flex items-center gap-3 transition-colors cursor-pointer font-medium ${chatMode === 'ai' ? 'bg-primary-900/40 text-primary-300' : 'bg-[#1A1A24] text-white'}`}
                    >
                      <Bot className="w-5 h-5 text-primary-400" />
                      Bara AI
                    </button>
                    
                    {chatMode === 'ai' && (
                      <button 
                        onClick={() => {
                          handleClearChat();
                          setIsTopMenuOpen(false);
                        }}
                        className="w-full mt-2 text-left px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white flex items-center gap-3 transition-colors cursor-pointer font-medium shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        New Chat
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex-1 flex justify-center">
            <div className="px-6 py-2 rounded-full border border-primary-500/40 bg-[#120F1D]/50 flex items-center justify-center">
              <h1 className="text-sm font-bold tracking-widest text-primary-400 font-mono uppercase">
                {chatMode === 'ai' ? 'Bara AI' : 'Room Chat'}
              </h1>
            </div>
          </div>

          <div className="w-12 h-12 flex items-center justify-end">
            {chatMode === 'room' ? (
              <button 
                onClick={() => setIsRoomSettingsOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
            ) : (
              <button 
                onClick={() => setIsSettingsMenuOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl border border-primary-500/30 text-primary-400 hover:bg-primary-900/10 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
            )}
          </div>
        </div>
      </header>

 {/* 
 =======================================================================
 KONTEN UTAMA APLIKASI (TAB BASED)
 =======================================================================
 */}
 <main className="flex-1 w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col overflow-hidden pb-4 max-w-3xl">
 
 <section className="flex flex-col flex-1 bg-[#0E0E12]/90 border border-primary-900/50 rounded-3xl overflow-hidden backdrop-blur-xl relative animate-fade-in mb-4 sm:mb-6">
 {/* Header Internal Area Chat */}
 

 {/* 2. CHAT AREA */}
 <div 
   ref={chatContainerRef}
   onScroll={handleScroll}
   className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
 >
   {chatMode === 'ai' && messages.map((msg) => {
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
         <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${
           isAi ? 'items-start' : 'items-end'
         }`}>
           <div className="flex items-center gap-2 px-1">
             <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
               {isAi ? 'Bara AI' : (userName || 'USER (Cak)')}
             </span>
             <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
           </div>
           <div className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed ${
             isAi 
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           }`}>
             <div className="whitespace-pre-wrap">
               {renderMessageText(msg.text)}
             </div>
             
             {isAi && (
               <div className="mt-3 pt-3 flex items-center gap-2">
                 <button 
                   onClick={() => handleCopy(msg.text)}
                   className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-gray-200 transition-colors"
                   title="Salin Pesan"
                 >
                   <Copy className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleFeedback(msg.id, 'up')}
                   className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-gray-200'}`}
                   title="Bagus"
                 >
                   <ThumbsUp className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleFeedback(msg.id, 'down')}
                   className={`p-1.5 rounded-md hover:bg-white/10 transition-colors ${msg.feedback === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-200'}`}
                   title="Buruk"
                 >
                   <ThumbsDown className="w-4 h-4" />
                 </button>
               </div>
             )}
           </div>
         </div>
         
         {/* Avatar User (sebelah kanan bubble user) */}
         {!isAi && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
       </div>
     );
   })}
   
   {chatMode === 'room' && roomMessages.map((msg) => {
     const isMe = msg.isMe;
     return (
       <motion.div 
         key={msg.id}
         className={`flex items-start gap-3 sm:gap-4 ${isMe ? 'justify-end' : 'justify-start'}`}
         drag={!isMe ? "x" : false}
         dragConstraints={{ left: 0, right: 0 }}
         dragElastic={{ left: 0.5, right: 0 }}
         onDragEnd={(e, info) => {
           if (!isMe && info.offset.x < -40) {
             setReplyingTo(msg);
           }
         }}
       >
         {!isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
         
         <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
           <div className="flex items-center gap-2 px-1">
             <span className="text-[10px] sm:text-xs font-mono font-medium text-gray-500">
               {msg.senderName}
             </span>
             <span className="text-[9px] sm:text-[10px] font-mono text-gray-600">{msg.timestamp}</span>
           </div>
           <div 
             onContextMenu={(e) => { e.preventDefault(); setSelectedRoomMessage(msg); }}
             className={`relative px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-3xl shadow-sm text-sm sm:text-base leading-relaxed cursor-pointer transition-colors hover:brightness-110 ${
             !isMe
               ? 'bg-[#1A1A24]/90 border border-primary-900/40 text-gray-200 rounded-tl-sm' 
               : 'bg-primary-900/20 border border-primary-500/30 text-white rounded-tr-sm'
           } ${msg.pin ? 'border-amber-500/50' : ''}`}>
             {msg.replyTo && (
               <div className="mb-2 p-2 rounded-lg bg-black/20 border-l-2 border-primary-500 text-xs">
                 <div className="text-primary-300 font-bold mb-0.5">{msg.replyTo.senderName}</div>
                 <div className="text-gray-300 line-clamp-2">{msg.replyTo.text}</div>
               </div>
             )}
             <div className="whitespace-pre-wrap">
               {msg.text}
             </div>
             {msg.isEdited && <div className="text-[10px] text-gray-500 mt-1 italic">(diedit)</div>}
             {msg.file && (
               <div className="mt-2 text-xs text-primary-300 flex items-center gap-1">
                 <Folder className="w-3 h-3" /> {msg.file.name}
               </div>
             )}
           </div>
           {/* Pencil Icon & Indicators */}
           <div className={`flex items-center gap-2 px-1 mt-0.5 text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
             {msg.star && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
             {msg.pin && <Pin className="w-3 h-3 text-amber-500 fill-amber-500" />}
             {isMe && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setEditingRoomMessageId(msg.id);
                   setInputCommand(msg.text);
                 }}
                 className="p-0.5 hover:text-primary-400 transition-colors cursor-pointer"
               >
                 <Pencil className="w-3 h-3" />
               </button>
             )}
           </div>
         </div>
         
         {isMe && (
           <div className="flex-shrink-0 mt-1">
             <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A24] border border-primary-900/50 flex items-center justify-center overflow-hidden">
               <UserCircle className="w-6 h-6 text-primary-500/50" />
             </div>
           </div>
         )}
       </motion.div>
     );
   })}

      {/* 
      -----------------------------------------------------------------
  {/* 
      -----------------------------------------------------------------
      SIMULASI AGENT BERPIKIR ("Agent sedang berpikir...")
 Tampil ketika isThinking == true
 -----------------------------------------------------------------
 */}
 {isThinking && chatMode === 'ai' && (
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
          ===================================================================
          */}
          <div className="px-4 sm:px-6 pb-6 pt-2 bg-transparent">
            {/* Kotak Input Textarea & Tombol Kirim */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (chatMode === 'ai') {
                  handleSendCommand();
                } else {
                  handleSendRoomMessage(inputCommand);
                  setInputCommand('');
                }
              }}
              className="flex flex-col gap-3 relative max-w-4xl mx-auto"
            >
              {editingRoomMessageId && chatMode === 'room' && (
                <div className="absolute -top-12 left-0 right-0 px-4 py-2 bg-primary-900/90 border border-primary-500/50 rounded-2xl backdrop-blur-xl flex items-center justify-between text-sm shadow-xl z-10 mx-auto max-w-4xl w-full">
                  <div className="flex flex-col overflow-hidden max-w-[90%]">
                    <span className="text-primary-400 font-bold text-xs flex items-center gap-1"><Pencil className="w-3 h-3"/> Mengedit Pesan</span>
                  </div>
                  <button type="button" onClick={() => { setEditingRoomMessageId(null); setInputCommand(''); }} className="p-1 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {replyingTo && !editingRoomMessageId && chatMode === 'room' && (
                <div className="absolute -top-12 left-0 right-0 px-4 py-2 bg-primary-900/90 border border-primary-500/50 rounded-2xl backdrop-blur-xl flex items-center justify-between text-sm shadow-xl z-10 mx-auto max-w-4xl w-full">
                  <div className="flex flex-col overflow-hidden max-w-[90%]">
                    <span className="text-primary-400 font-bold text-xs flex items-center gap-1"><Reply className="w-3 h-3"/> Membalas {replyingTo.senderName}</span>
                    <span className="text-gray-300 truncate text-xs">{replyingTo.text}</span>
                  </div>
                  <button type="button" onClick={() => setReplyingTo(null)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="relative flex items-center px-2 py-2 bg-[#120F1D]/80 border border-primary-500/30 rounded-3xl shadow-lg transition-all focus-within:border-primary-500/60 focus-within:bg-[#151025]/90">
                
                {/* Attachment Button */}
                <div className="relative shrink-0 flex items-center">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  
                  {chatMode === 'ai' ? (
                    <button
                      type="button"
                      onClick={handleFileUploadClick}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary-900/20 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer ml-1"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-primary-900/20 text-primary-400 hover:bg-primary-500/20 transition-colors cursor-pointer ml-1"
                      >
                        <Plus className={`w-5 h-5 transition-transform duration-300 ${isAttachmentMenuOpen ? 'rotate-45' : ''}`} />
                      </button>
                      
                      {isAttachmentMenuOpen && (
                        <div className="absolute bottom-full left-0 mb-3 w-40 bg-[#141416]/95 backdrop-blur-xl border border-primary-500/40 rounded-2xl overflow-hidden animate-fade-in p-2 flex flex-col gap-1 z-50">
                          <button 
                            type="button"
                            onClick={() => { setIsAttachmentMenuOpen(false); handleFileUploadClick(); }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                          >
                            <Camera className="w-4 h-4 text-primary-400" />
                            <span>Kamera</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setIsAttachmentMenuOpen(false); handleFileUploadClick(); }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                          >
                            <ImageIcon2 className="w-4 h-4 text-primary-400" />
                            <span>Galeri</span>
                          </button>
                          <button 
                            type="button"
                            onClick={() => { setIsAttachmentMenuOpen(false); handleFileUploadClick(); }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:text-primary-300 hover:bg-primary-900/30 rounded-xl transition-all cursor-pointer"
                          >
                            <Folder className="w-4 h-4 text-primary-400" />
                            <span>File</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Textarea */}
                <div className="flex-1 px-3 py-1 flex items-center">
                  <textarea
                    value={inputCommand}
                    onChange={(e) => setInputCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (chatMode === 'ai') {
                          handleSendCommand();
                        } else {
                          handleSendRoomMessage(inputCommand);
                          setInputCommand('');
                        }
                      }
                    }}
                    placeholder={chatMode === 'ai' ? "Message Bara AI..." : "Kirim pesan ke room..."}
                    className="w-full bg-transparent text-gray-200 focus:outline-none resize-none overflow-hidden min-h-[24px] h-[24px] pt-[2px] text-sm sm:text-base placeholder-gray-500 font-mono tracking-wide"
                    rows={1}
                    disabled={isThinking && chatMode === 'ai'}
                  />
                </div>

                {/* Tombol Kirim */}
                <button
                  type="submit"
                  disabled={(isThinking && chatMode === 'ai') || !inputCommand.trim()}
                  className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all cursor-pointer mr-1 ${
                    inputCommand.trim()
                      ? 'bg-primary-700 hover:bg-primary-600 text-white' 
                      : 'bg-primary-900/30 text-primary-500/50'
                  }`}
                >
                  {(isThinking && chatMode === 'ai') ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className={`w-4 h-4 ${inputCommand.trim() ? 'ml-0.5 -mt-0.5' : 'ml-0.5'}`} />
                  )}
                </button>
              </div>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-gray-500 font-mono">
                  {chatMode === 'ai' 
                    ? "Bara AI dapat membuat kesalahan. Periksa info penting." 
                    : "Room Chat: Terhubung secara real-time ke semua klien."}
                </p>
              </div>
            </form>
          </div>
 </section>
 
 </main>

 {/* 
 =======================================================================
 BOTTOM NAVIGATION
 =======================================================================
 */}
 
      {/* Room Message Action Popup */}
      {selectedRoomMessage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedRoomMessage(null)}>
          <div 
            className="w-full max-w-xs bg-[#141416] border border-primary-900/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-primary-900/30">
              <p className="text-gray-300 text-sm line-clamp-2 italic">"{selectedRoomMessage.text}"</p>
            </div>
            <div className="p-2 flex justify-around">
              <button 
                onClick={() => handleRoomMessageAction('delete')}
                className="flex-1 flex flex-col items-center gap-2 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-xs font-medium">Hapus</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('star')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${selectedRoomMessage.star ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Star className={`w-5 h-5 ${selectedRoomMessage.star ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">Bintang</span>
              </button>
              <button 
                onClick={() => handleRoomMessageAction('pin')}
                className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-colors cursor-pointer ${selectedRoomMessage.pin ? 'text-amber-500 bg-amber-500/10' : 'text-gray-400 hover:bg-white/5'}`}
              >
                <Pin className={`w-5 h-5 ${selectedRoomMessage.pin ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">Sematkan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Settings Modal */}
      {isRoomSettingsOpen && chatMode === 'room' && (
        <div className="fixed inset-0 z-[100] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setIsRoomSettingsOpen(false)}>
          <div 
            className="w-full max-w-sm bg-[#141416] border border-primary-900/50 rounded-3xl shadow-2xl overflow-hidden mt-12 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-primary-900/30 flex items-center justify-between">
              <h2 className="text-lg font-orbitron font-bold text-white">Setting Room Chat</h2>
              <button onClick={() => setIsRoomSettingsOpen(false)} className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300">Wallpaper Background</label>
                <input 
                  type="file" 
                  ref={wallpaperInputRef} 
                  onChange={handleWallpaperChange} 
                  accept="image/*,video/*"
                  className="hidden" 
                />
                <button 
                  onClick={() => wallpaperInputRef.current?.click()}
                  className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors cursor-pointer"
                >
                  Ganti Foto / Video (Maks 20s)
                </button>
                {roomWallpaper && (
                  <button 
                    onClick={() => { setRoomWallpaper(null); setRoomWallpaperType(null); }}
                    className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors mt-2 cursor-pointer"
                  >
                    Hapus Wallpaper
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-primary-900/30">
                <button 
                  onClick={() => {
                    setIsRoomSettingsOpen(false);
                    setIsStarredMessagesOpen(true);
                  }}
                  className="w-full py-3 rounded-xl border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Star className="w-5 h-5 fill-current" />
                  Pesan Berbintang
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Starred Messages Sidebar */}
      {isStarredMessagesOpen && chatMode === 'room' && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsStarredMessagesOpen(false)}></div>
          <div className="fixed inset-y-0 right-0 w-80 bg-[#09090b] border-l border-primary-500/30 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            <div className="p-4 border-b border-primary-900/30 flex items-center justify-between">
              <h2 className="text-lg font-orbitron font-bold text-yellow-400 flex items-center gap-2">
                <Star className="w-5 h-5 fill-current" />
                Pesan Berbintang
              </h2>
              <button onClick={() => setIsStarredMessagesOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-gray-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
              {roomMessages.filter(msg => msg.star).length === 0 ? (
                <div className="text-center text-gray-500 mt-10 text-sm">
                  Belum ada pesan berbintang
                </div>
              ) : (
                roomMessages.filter(msg => msg.star).map(msg => (
                  <div key={`star-${msg.id}`} className="bg-[#1A1A24] border border-primary-900/30 p-3 rounded-xl flex flex-col gap-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-primary-400 font-bold">{msg.senderName}</span>
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-4">{msg.text}</p>
                    <button 
                      onClick={() => {
                        setRoomMessages(prev => prev.map(m => m.id === msg.id ? { ...m, star: false } : m));
                      }}
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-lg text-gray-400 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

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
              
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-primary-900/30">
                <button 
                  onClick={() => setShowClearHistoryConfirm(true)}
                  className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Riwayat Pesan
                </button>
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-red-600/20 border border-red-500/50 text-red-500 hover:bg-red-600/30 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      
      {/* Confirm Clear History Modal */}
      {showClearHistoryConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowClearHistoryConfirm(false)}>
          <div className="bg-[#141416] border border-red-500/50 rounded-2xl w-full max-w-xs p-6 shadow-2xl scale-100 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center mb-2">Hapus Riwayat?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Yakin ingin hapus riwayat pesan?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearHistoryConfirm(false)} className="flex-1 py-2 rounded-xl bg-[#2A2A35] text-white hover:bg-[#3A3A45] font-medium transition-colors cursor-pointer text-sm">
                Batal
              </button>
              <button onClick={() => { handleClearChat(); setShowClearHistoryConfirm(false); setIsSettingsMenuOpen(false); }} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer text-sm">
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setShowLogoutConfirm(false)}>
          <div className="bg-[#141416] border border-red-500/50 rounded-2xl w-full max-w-xs p-6 shadow-2xl scale-100 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white text-center mb-2">Log Out?</h3>
            <p className="text-sm text-gray-400 text-center mb-6">Yakin ingin log out dari akun ini?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2 rounded-xl bg-[#2A2A35] text-white hover:bg-[#3A3A45] font-medium transition-colors cursor-pointer text-sm">
                Batal
              </button>
              <button onClick={() => { 
                setUserName(''); 
                localStorage.removeItem(STORAGE_KEY_USERNAME); 
                setShowLogoutConfirm(false); 
                setIsSettingsMenuOpen(false); 
              }} className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer text-sm">
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

</div>
 );
}

