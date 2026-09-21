import { useState, useEffect } from 'react';
import { searchUsers, sendFriendRequest, respondToRequest, getFriends } from '../api/friends';
import { Users, UserPlus, Check, X, Search, MessageCircle } from 'lucide-react';
import Chat from '../components/Chat';

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [activeChatFriend, setActiveChatFriend] = useState(null);

  const fetchFriends = async () => {
    const res = await getFriends();
    setFriends(res.data.friends);
    setPending(res.data.pendingReceived);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const res = await searchUsers(query);
    setResults(res.data);
  };

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId);
      setMessage('Request sent!');
      setResults(results.filter((r) => r.id !== userId));
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error sending request');
    }
  };

  const handleRespond = async (id, status) => {
    await respondToRequest(id, status);
    fetchFriends();
  };

  return (
    <div className="bg-bg min-h-screen p-8">
      <h1 className="text-primary text-2xl font-semibold mb-6 flex items-center gap-2">
        <Users size={24} /> Friends
      </h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text" placeholder="Search by name or email"
          className="flex-1 p-3 rounded-lg border border-border bg-surface text-text text-sm"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="bg-primary text-white px-4 rounded-lg">
          <Search size={18} />
        </button>
      </form>

      {message && <p className="text-primary text-sm mb-4 max-w-md">{message}</p>}

      {results.length > 0 && (
        <div className="max-w-md space-y-2 mb-6">
          {results.map((u) => (
            <div key={u.id} className="bg-surface border border-border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-text text-sm font-medium">{u.name}</p>
                <p className="text-text-muted text-xs">{u.email}</p>
              </div>
              <button onClick={() => handleSendRequest(u.id)} className="text-primary">
                <UserPlus size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pending requests */}
      {pending.length > 0 && (
        <div className="max-w-md mb-6">
          <p className="text-text-muted text-sm mb-2">Pending requests</p>
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.id} className="bg-primary-soft rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-text text-sm font-medium">{p.name}</p>
                  <p className="text-text-muted text-xs">{p.email}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleRespond(p.id, 'accepted')} className="text-primary">
                    <Check size={18} />
                  </button>
                  <button onClick={() => handleRespond(p.id, 'rejected')} className="text-danger">
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div className="max-w-md">
        <p className="text-text-muted text-sm mb-2">Your friends ({friends.length})</p>
        {friends.length === 0 && <p className="text-text-muted text-sm">No friends yet — search above to add some.</p>}
        <div className="space-y-2">
          {friends.map((f) => (
            <div key={f.id} className="bg-surface border border-border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="text-text text-sm font-medium">{f.name}</p>
                <p className="text-text-muted text-xs">{f.email}</p>
              </div>
              <button onClick={() => setActiveChatFriend(f)} className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm bg-primary-soft px-3 py-1.5 rounded-lg transition-colors">
                <MessageCircle size={16} /> Chat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Modal */}
      {activeChatFriend && (
        <Chat friend={activeChatFriend} onClose={() => setActiveChatFriend(null)} />
      )}
    </div>
  );
}