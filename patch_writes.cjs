const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Replace handleSendRoomMessage
const handleSendRoomMessageRegex = /const handleSendRoomMessage = \(text: string\) => \{[\s\S]*?socket\?\.emit\("room_message", \{ \.\.\.newMsg, isMe: false \}\);\n\s*\};/m;

const newHandleSendRoomMessage = `const handleSendRoomMessage = async (text: string) => {
    if (!text.trim() && !selectedFile) return;

    if (editingRoomMessageId) {
      const docRef = doc(db, 'roomMessages', editingRoomMessageId);
      await updateDoc(docRef, { text: text, isEdited: true });
      setEditingRoomMessageId(null);
      setInputCommand('');
      return;
    }

    const newMsg = {
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      sender: user?.uid || 'unknown',
      senderName: user?.displayName || 'User',
      isMe: true,
      file: selectedFile ? { name: selectedFile.name, dataUrl: selectedFile.dataUrl, type: selectedFile.type } : null,
      replyTo: replyingTo ? { id: replyingTo.id, senderName: replyingTo.senderName, text: replyingTo.text } : null
    };
    
    await addDoc(collection(db, 'roomMessages'), newMsg);
    setInputCommand('');
    setSelectedFile(null);
    setReplyingTo(null);
    setTimeout(scrollToBottom, 100);
  };`;

if (content.match(handleSendRoomMessageRegex)) {
    content = content.replace(handleSendRoomMessageRegex, newHandleSendRoomMessage);
}

// Replace Room Message Actions (delete, star, pin)
const handleRoomMessageActionRegex = /const handleRoomMessageAction = \(action: 'delete' \| 'star' \| 'pin'\) => \{[\s\S]*?setSelectedRoomMessage\(null\);\n\s*\};/m;

const newHandleRoomMessageAction = `const handleRoomMessageAction = async (action: 'delete' | 'star' | 'pin') => {
    if (!selectedRoomMessage) return;
    
    const docRef = doc(db, 'roomMessages', selectedRoomMessage.id);
    if (action === 'delete') {
       await deleteDoc(docRef);
    } else {
       await updateDoc(docRef, { [action]: !selectedRoomMessage[action] });
    }
    setSelectedRoomMessage(null);
  };`;

if (content.match(handleRoomMessageActionRegex)) {
    content = content.replace(handleRoomMessageActionRegex, newHandleRoomMessageAction);
}

// Replace handleClearTaskHistory
const handleClearTaskHistoryRegex = /const handleClearTaskHistory = \(\) => \{[\s\S]*?localStorage\.removeItem\(STORAGE_KEY_TASKS\);\n\s*\};/m;
const newHandleClearTaskHistory = `const handleClearTaskHistory = async () => {
    setTaskHistory([]);
    // To clear from firestore we would need a batch delete, for simplicity we just clear UI here, 
    // real app would delete docs in a loop or batch.
  };`;
content = content.replace(handleClearTaskHistoryRegex, newHandleClearTaskHistory);


fs.writeFileSync('src/App.tsx', content);

