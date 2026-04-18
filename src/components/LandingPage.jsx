import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, USERS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Leaf, Zap, ArrowRight, TrendingUp, Shield, Globe, BarChart2,
  X, Eye, EyeOff, Sun, Moon, Check, ChevronDown, ChevronRight
} from 'lucide-react';

// ─── Animated counter hook ───
function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start = Math.min(start + step, target);
      setVal(Math.floor(start));
      if (start >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

function StatPill({ value, label, prefix = '', suffix = '' }) {
  const n = useCounter(typeof value === 'number' ? value : 0);
  return (
    <div className="text-center">
      <div className="text-3xl font-black text-white">{prefix}{typeof value === 'number' ? n.toLocaleString() : value}{suffix}</div>
      <div className="text-xs text-green-200 mt-1">{label}</div>
    </div>
  );
}

// ─── Auth Modal ───
function AuthModal({ mode, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(mode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const ok = login(email.trim(), password);
    if (!ok) setError('Invalid email or password.');
    else { onClose(); navigate('/dashboard'); }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // For demo: auto-login as admin after signup
    login('school@ecosense.ai', 'school123');
    onClose();
    navigate('/dashboard');
    setLoading(false);
  };

  const DEMO = [
    { label: 'School', email: 'school@ecosense.ai', pw: 'school123' },
    { label: 'College', email: 'college@ecosense.ai', pw: 'college123' },
    { label: 'Factory', email: 'factory@ecosense.ai', pw: 'factory123' },
    { label: 'Corporate', email: 'corporate@ecosense.ai', pw: 'corp123' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Leaf size={18} className="text-white" />
              <span className="text-white font-bold text-sm">EcoSense AI</span>
            </div>
            <h2 className="text-white text-xl font-black">Carbon Credit Marketplace</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          {['login', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${tab === t ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30" />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {error && <div className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Signing in…' : 'Sign In to Marketplace'}
              </button>

              {/* Demo accounts */}
              <div className="mt-1">
                <p className="text-xs text-gray-400 text-center mb-2">Try a demo account</p>
                <div className="grid grid-cols-3 gap-2">
                  {DEMO.map(d => (
                    <button key={d.email} type="button" onClick={() => { setEmail(d.email); setPassword(d.pw); }}
                      className="py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 transition-colors font-medium">
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Work Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30" />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              {error && <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</div>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {loading ? 'Creating account…' : 'Create Free Account'}
              </button>
              <p className="text-xs text-gray-400 text-center">By signing up you agree to our Terms of Service and Privacy Policy.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    step: '01', icon: '🌳',
    title: 'Project Generates Credits',
    desc: 'A verified climate project (solar farm, forest, biogas) proves it avoids or sequesters 1 tonne of CO₂. Each tonne = 1 carbon credit.',
  },
  {
    step: '02', icon: '🏅',
    title: 'Verification & Certification',
    desc: 'Independent auditors (Verra, Gold Standard) verify the emission reductions and issue certified credits with serial numbers.',
  },
  {
    step: '03', icon: '💹',
    title: 'Trade on the Marketplace',
    desc: 'Organisations buy credits to offset their emissions or invest in climate action. AI pricing finds the optimal market rate.',
  },
  {
    step: '04', icon: '🔒',
    title: 'Retire & Report',
    desc: "When a credit is used to offset emissions, it's permanently retired. Your ESG reports show verified, auditable offsets.",
  },
];

const FEATURES = [
  { icon: BarChart2, title: 'AI Price Intelligence', desc: 'ML models predict optimal pricing windows and send real-time hold/sell signals.', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { icon: Shield, title: 'Verified Credits Only', desc: 'Every credit is Verra VCS or Gold Standard certified. Zero greenwashing risk.', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { icon: Globe, title: 'Multi-Sector Portfolio', desc: 'Solar, wind, biogas, forests, blue carbon — diversify across climate solutions.', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { icon: TrendingUp, title: 'ESG Report Generation', desc: 'Auto-generate audit-ready sustainability reports for SEBI BRSR, CDP and GHG Protocol.', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
];

export default function LandingPage() {
  const { isDark, toggle } = useTheme();
  const [modal, setModal] = useState(null); // 'login' | 'signup' | null
  const [faqOpen, setFaqOpen] = useState(null);

  const FAQS = [
    { q: 'What is a carbon credit?', a: '1 carbon credit = 1 tonne of CO₂ equivalent (tCO₂e) avoided or removed from the atmosphere by a verified climate project.' },
    { q: 'How is the price determined?', a: 'EcoSense AI uses a pricing model: Base (₹1,200) × Certification multiplier × Sector premium × AI demand score. Live market dynamics adjust the AI multiplier.' },
    { q: 'What commission does EcoSense charge?', a: 'We charge 10% for Verra VCS, 12% for Gold Standard, and 15% for unverified credits. Sellers receive the net amount after commission.' },
    { q: 'Are my credits real and auditable?', a: 'Yes. All credits on the platform are verified by Verra or Gold Standard. Serial numbers are traceable. Retired credits are permanently recorded.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {modal && <AuthModal mode={modal} onClose={() => setModal(null)} />}

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 border-b border-gray-100 dark:border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-black text-gray-900 dark:text-white text-sm">EcoSense AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-8">
            {['How It Works', 'Marketplace', 'Features', 'FAQ'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">{l}</a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={toggle} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button onClick={() => setModal('login')}
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 transition-colors">
              Sign In
            </button>
            <button onClick={() => setModal('signup')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm font-bold hover:from-green-500 hover:to-blue-500 transition-all shadow-lg shadow-green-600/20">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-gray-900 to-blue-950 py-24 px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(#16A34A 1px, transparent 1px), linear-gradient(90deg, #16A34A 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 text-xs font-semibold mb-6">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live Carbon Market — Apr 18, 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Turn Climate Action{' '}
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Into Real Value
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            India's most intelligent carbon credit marketplace. Buy, sell, and retire verified credits with AI-powered pricing, real-time analytics, and ESG reporting — all in one platform.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => setModal('signup')}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold text-base transition-all shadow-xl shadow-green-500/30 hover:scale-105">
              Start Selling Credits <ArrowRight size={18} />
            </button>
            <button onClick={() => setModal('login')}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/20 hover:border-white/40 text-white font-bold text-base transition-all hover:bg-white/5">
              Buy Credits <TrendingUp size={18} />
            </button>
          </div>

          {/* Live stats ticker */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatPill value={48200} label="Credits Traded Today" suffix="+" />
            <StatPill value={1580} label="Market Price (₹/tCO₂e)" prefix="₹" />
            <StatPill value={920} label="Active Projects" />
            <StatPill value={2.4} label="24h Price Change %" suffix="%" />
          </div>
        </div>
      </section>

      {/* ── Sector price ticker ── */}
      <div className="bg-gray-900 dark:bg-gray-950 border-y border-gray-800 py-3 overflow-hidden">
        <div className="flex gap-8 animate-[ticker_20s_linear_infinite] whitespace-nowrap">
          {[...Array(3)].flatMap(() => [
            { name: '☀️ Solar', price: '₹1,450', ch: '+3.2%', up: true },
            { name: '🌬️ Wind', price: '₹1,380', ch: '+1.8%', up: true },
            { name: '🌿 Biogas', price: '₹1,620', ch: '+5.1%', up: true },
            { name: '🏔️ Forest', price: '₹1,420', ch: '-0.8%', up: false },
            { name: '🌊 Blue Carbon', price: '₹1,750', ch: '+2.9%', up: true },
            { name: '⚡ Transport', price: '₹1,580', ch: '+4.2%', up: true },
          ]).map((s, i) => (
            <span key={i} className="text-xs text-gray-400 flex items-center gap-2">
              <span className="font-semibold text-gray-200">{s.name}</span>
              <span>{s.price}</span>
              <span className={s.up ? 'text-green-400' : 'text-red-400'}>{s.ch}</span>
              <span className="text-gray-700 mx-2">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-3">How It Works</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Carbon Credits, Simplified</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">From emission avoidance to verified credit to marketplace trade — here's the complete lifecycle</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-green-500 to-blue-500 opacity-30" />
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm text-center card-hover">
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-3xl font-black text-gray-100 dark:text-gray-700 absolute top-4 right-4">{step.step}</div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">Platform Features</div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Built for Serious Climate Finance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm card-hover">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marketplace preview ── */}
      <section id="marketplace" className="py-20 px-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-3">Live Marketplace</div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Featured Projects</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {[
              { emoji: '☀️', name: 'Maharashtra Solar Farm', type: 'Solar Energy', cert: 'Verra VCS', price: '₹1,450', avail: '1,800 credits', change: '+3.2%' },
              { emoji: '🌿', name: 'Gujarat Biogas Initiative', type: 'Biogas', cert: 'Gold Standard', price: '₹1,620', avail: '800 credits', change: '+5.1%' },
              { emoji: '🌊', name: 'Sundarbans Mangrove', type: 'Blue Carbon', cert: 'Gold Standard', price: '₹1,750', avail: '600 credits', change: '+2.9%' },
            ].map((p, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{p.emoji}</div>
                  <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">{p.cert}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{p.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{p.type}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">{p.price}<span className="text-xs text-gray-400 font-normal">/credit</span></div>
                    <div className="text-xs text-gray-400">{p.avail}</div>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">{p.change}</span>
                </div>
                <button onClick={() => setModal('login')}
                  className="w-full mt-3 py-2 rounded-xl border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                  Buy Credits →
                </button>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => setModal('signup')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all shadow-lg shadow-green-600/20">
              View All 6+ Projects <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-6 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Common Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-4">Start Your Carbon Journey Today</h2>
          <p className="text-white/80 mb-8">Join thousands of organisations buying, selling and retiring carbon credits on India's most transparent marketplace.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => setModal('signup')}
              className="px-8 py-4 rounded-2xl bg-white text-green-700 font-black text-base hover:bg-green-50 transition-all shadow-xl hover:scale-105">
              Start Selling Now
            </button>
            <button onClick={() => setModal('login')}
              className="px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-bold text-base hover:bg-white/10 transition-all">
              Buy Credits
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 dark:bg-gray-950 py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm">EcoSense AI</span>
            <span className="text-gray-500 text-xs">— Predictive Carbon Intelligence Platform</span>
          </div>
          <div className="text-xs text-gray-500">© 2026 EcoSense Technologies Pvt Ltd · All carbon credits verified</div>
        </div>
      </footer>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
