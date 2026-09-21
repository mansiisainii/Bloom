import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Add at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Add at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Add at least one number';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Add at least one special character';
  return '';
};

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const res = await api.post('/auth/signup', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-8 w-full max-w-sm">
        <h1 className="text-primary text-2xl font-semibold mb-6">Join Bloom 🌸</h1>
        {error && <p className="text-danger text-sm mb-4">{error}</p>}
        <input
          type="text" placeholder="Name" required
          className="w-full mb-3 p-3 rounded-lg border border-border bg-bg text-text"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email" placeholder="Email" required
          className="w-full mb-3 p-3 rounded-lg border border-border bg-bg text-text"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password" placeholder="Password" required
          className="w-full mb-1 p-3 rounded-lg border border-border bg-bg text-text"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <p className="text-text-muted text-xs mb-4">
          Min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        </p>
        <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-medium">
          Sign Up
        </button>
        <p className="text-text-muted text-sm mt-4 text-center">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}