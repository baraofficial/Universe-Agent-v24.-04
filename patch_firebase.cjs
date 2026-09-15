const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add Firebase imports
const imports = `
import { auth, db, googleProvider } from './lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, orderBy } from 'firebase/firestore';
`;
content = content.replace("import { io, Socket } from 'socket.io-client';", "import { io, Socket } from 'socket.io-client';" + imports);


// 2. Add Auth state and early return inside App component
const authHook = `
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  if (isAuthLoading) {
    return <div className="flex h-screen items-center justify-center bg-[#050505] text-primary-500"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-4 font-mono">
        <div className="max-w-md w-full bg-[#141416] border border-primary-500/30 rounded-3xl p-8 flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50"></div>
          <div className="w-20 h-20 bg-primary-900/30 rounded-2xl flex items-center justify-center mb-6 border border-primary-500/40 p-2">
             <img src="/bara-ai-logo.jpg" alt="Bara AI Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-200 mb-2 font-orbitron tracking-wider">BARA AI</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Masuk untuk melanjutkan ke sistem AI Assistant dan Room Chat.</p>
          <button onClick={handleLogin} className="w-full py-3.5 px-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Login dengan Google
          </button>
        </div>
      </div>
    );
  }
`;
content = content.replace("export default function App() {\n", "export default function App() {\n" + authHook);


// Update Chat Sessions to use Firestore
const chatSessionsRegex = /const \[chatSessions, setChatSessions\] = useState<ChatSession\[\]>\(\(\) => \{[\s\S]*?\}\);/m;
content = content.replace(chatSessionsRegex, "const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);");

// Update Messages to be empty initially
const messagesRegex = /const \[messages, setMessages\] = useState<ChatMessage\[\]>\(\(\) => \{[\s\S]*?\}\);/m;
content = content.replace(messagesRegex, `const [messages, setMessages] = useState<ChatMessage[]>([{
      id: 'welcome',
      sender: 'ai',
      text: 'Halo! Ada yang bisa dibantu hari ini?',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      toolUsed: 'Umum'
}]);`);

// Add Firestore Effects for Data sync
const firestoreEffects = `
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'chatSessions'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessions: ChatSession[] = [];
      snapshot.forEach(doc => {
        sessions.push({ id: doc.id, ...doc.data() } as ChatSession);
      });
      // Sort desc by updatedAt
      sessions.sort((a, b) => b.updatedAt - a.updatedAt);
      setChatSessions(sessions);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'roomMessages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: any[] = [];
      snapshot.forEach(doc => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setRoomMessages(msgs);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'taskHistory'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks: TaskHistoryItem[] = [];
      snapshot.forEach(doc => {
        tasks.push({ id: doc.id, ...doc.data() } as TaskHistoryItem);
      });
      setTaskHistory(tasks);
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'savedNotes'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes: SavedNote[] = [];
      snapshot.forEach(doc => {
        notes.push({ id: doc.id, ...doc.data() } as SavedNote);
      });
      setSavedNotes(notes);
    });
    return unsubscribe;
  }, [user]);
`;

// Remove local storage effect for chat sessions
content = content.replace(/useEffect\(\(\) => \{\s*localStorage\.setItem\('bara_chat_sessions'[\s\S]*?\}, \[chatSessions\]\);/, firestoreEffects);

// Overwrite the file
fs.writeFileSync('src/App.tsx', content);

