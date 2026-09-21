import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-primary text-2xl font-semibold mb-6">Welcome back 🌸</h1>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <input
          type="email" placeholder="Email" required
          className="w-full mb-3 p-3 rounded-lg border border-border bg-bg text-text"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password" placeholder="Password" required
          className="w-full mb-4 p-3 rounded-lg border border-border bg-bg text-text"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-medium">
          Login
        </button>
        <p className="text-text-muted text-sm mt-4 text-center">
          New here? <Link to="/signup" className="text-primary">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}