import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../api/messages';
import { X, Send, Image as ImageIcon } from 'lucide-react';

export default function Chat({ friend, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchChat = async () => {
    try {
      const res = await getMessages(friend.friend_id);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 3000); // Simple polling every 3 seconds
    return () => clearInterval(interval);
  }, [friend.friend_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    try {
      await sendMessage(friend.friend_id, { content: text, image_url: image });
      setText('');
      setImage(null);
      fetchChat();
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-surface border border-border w-full max-w-lg h-[80vh] rounded-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-bg">
          <h2 className="text-primary font-semibold text-lg">Chat with {friend.name}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-primary">
            <X size={20} />
          </button>
        </div>

        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg">
          {messages.map((m) => {
            const isMe = m.sender_id === currentUserId;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-3 rounded-xl ${isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-surface border border-border text-text rounded-bl-sm'}`}>
                  {m.image_url && <img src={m.image_url} alt="Shared snap" className="max-w-full h-auto rounded mb-2" />}
                  {m.content && <p className="text-sm">{m.content}</p>}
                  <span className={`text-[10px] mt-1 block ${isMe ? 'text-white/70' : 'text-text-muted'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        {image && (
          <div className="p-2 border-t border-border flex justify-between items-center bg-surface">
            <span className="text-xs text-primary font-medium">Image attached</span>
            <button onClick={() => setImage(null)} className="text-danger text-xs hover:underline">Remove</button>
          </div>
        )}
        <form onSubmit={handleSend} className="p-4 border-t border-border bg-bg flex items-center gap-2">
          <label className="text-text-muted hover:text-primary cursor-pointer p-2">
            <ImageIcon size={20} />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:border-primary"
          />
          <button type="submit" className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
