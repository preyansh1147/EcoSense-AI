import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, USERS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Eye, EyeOff, Sun, Moon, Leaf, Zap } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email.trim(), password);
    if (!ok) setError('Invalid credentials. Try one of the sample accounts below.');
    else navigate(from, { replace: true });
    setLoading(false);
  };

  const fillCreds = (e) => {
    setEmail(e);
    setPassword(USERS[e].password);
    setError('');
  };

  const SAMPLE_CREDS = [
    { email: 'school@ecosense.ai', label: 'School', color: 'emerald' },
    { email: 'college@ecosense.ai', label: 'College', color: 'cyan' },
    { email: 'factory@ecosense.ai', label: 'Factory', color: 'teal' },
    { email: 'corporate@ecosense.ai', label: 'Corporate', color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Theme toggle */}
      <button onClick={toggle} className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-glow">
                <Leaf size={24} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
                <Zap size={8} className="text-white" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white leading-none">EcoSense AI</h1>
              <p className="text-xs text-emerald-400 mt-0.5">Predictive Carbon Intelligence Platform</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Sign in to your energy command center</p>
        </div>

        {/* Card */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-6 shadow-2xl glass">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sample credentials */}
        <div className="mt-4 bg-gray-900/60 border border-gray-700/40 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-3 text-center">Quick sign-in with sample accounts</p>
          <div className="grid grid-cols-3 gap-2">
            {SAMPLE_CREDS.map(({ email, label, color }) => (
              <button key={email} onClick={() => fillCreds(email)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all hover:scale-105 bg-${color}-500/10 border-${color}-500/30 text-${color}-400 hover:bg-${color}-500/20`}>
                {label}
                <div className="text-gray-500 text-[10px] mt-0.5 truncate">{USERS[email].password}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
