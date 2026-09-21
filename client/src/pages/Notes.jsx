import { useState, useEffect } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from '../api/notes';
import { format } from 'date-fns';
import { Smile, Frown, Meh, PartyPopper, Zap, Heart, BookHeart, Pencil, Trash2 } from 'lucide-react';

const MOODS = [
  { value: 'happy', icon: Smile },
  { value: 'sad', icon: Frown },
  { value: 'neutral', icon: Meh },
  { value: 'excited', icon: PartyPopper },
  { value: 'stressed', icon: Zap },
  { value: 'grateful', icon: Heart },
];

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral');
  const [editingId, setEditingId] = useState(null);
  const [filterMood, setFilterMood] = useState('all');

  const fetchNotes = async () => {
    const res = await getNotes();
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (editingId) {
      await updateNote(editingId, { content, mood });
      setEditingId(null);
    } else {
      await createNote({ content, mood });
    }
    setContent('');
    setMood('neutral');
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditingId(note.id);
    setContent(note.content);
    setMood(note.mood);
  };

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  const filteredNotes = filterMood === 'all' ? notes : notes.filter((n) => n.mood === filterMood);
  const getMoodIcon = (value) => MOODS.find((m) => m.value === value)?.icon || Meh;

  return (
    <div className="bg-bg min-h-screen p-8">
      <h1 className="text-primary text-2xl font-semibold mb-6 flex items-center gap-2">
        <BookHeart size={24} /> Journal
      </h1>

      {/* New/Edit note form */}
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 max-w-md mb-6">
        <textarea
          placeholder="What's on your mind?"
          rows={4}
          className="w-full p-3 rounded-lg border border-border bg-bg text-text resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex gap-2 my-3 flex-wrap">
          {MOODS.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  mood === m.value ? 'bg-primary text-white' : 'bg-bg border border-border text-text-muted'
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-medium">
          {editingId ? 'Update Entry' : 'Save Entry'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setContent(''); setMood('neutral'); }}
            className="w-full text-text-muted text-sm mt-2"
          >
            Cancel edit
          </button>
        )}
      </form>

      {/* Mood filter */}
      <div className="flex gap-2 mb-4 max-w-md flex-wrap">
        <button
          onClick={() => setFilterMood('all')}
          className={`px-3 py-1 rounded-full text-sm ${filterMood === 'all' ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted'}`}
        >
          All
        </button>
        {MOODS.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.value}
              onClick={() => setFilterMood(m.value)}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${filterMood === m.value ? 'bg-primary text-white' : 'bg-surface border border-border text-text-muted'}`}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>

      {/* Notes list */}
      <div className="max-w-md space-y-3">
        {filteredNotes.length === 0 && <p className="text-text-muted text-sm">No entries yet.</p>}
        {filteredNotes.map((note) => {
          const MoodIcon = getMoodIcon(note.mood);
          return (
            <div key={note.id} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-primary"><MoodIcon size={20} /></span>
                <span className="text-text-muted text-xs">{format(new Date(note.created_at), 'MMM d, h:mm a')}</span>
              </div>
              <p className="text-text text-sm mb-3">{note.content}</p>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(note)} className="text-primary text-xs flex items-center gap-1">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => handleDelete(note.id)} className="text-danger text-xs flex items-center gap-1">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}