import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SUGGESTED = [
  'What is my energy usage today?',
  'How can I reduce carbon emissions?',
  'Explain carbon credits',
  'What is my ESG score?',
  'Show me energy saving tips',
  'How does carbon trading work?',
];

function buildResponse(input, user, data) {
  const q = input.toLowerCase();
  const sector = user?.sector || 'hospital';
  const org = user?.org || 'your organization';
  const live = data?.live;
  const cc = data?.carbonCredit;
  const dna = data?.sectorDNA;

  if (q.match(/energy|usage|consumption|kwh/)) {
    return `⚡ ${org} is currently consuming **${live?.energy?.toLocaleString() ?? 'N/A'} kWh** today.\n\nPeak hours are typically **${dna?.peakHour ?? 'daytime'}** with a base load of **${dna?.baseLoad ?? 'N/A'}**. Your renewable share stands at **${live?.renewable ?? 0}%**.`;
  }

  if (q.match(/co2|carbon emission|emission|carbon footprint/)) {
    return `🌍 Today's CO₂ output from ${org} is **${live?.co2?.toLocaleString() ?? 'N/A'} kg**.\n\nYour energy cost today is **₹${live?.cost?.toLocaleString() ?? 'N/A'}**. Sector comparison: you are **${Math.abs(dna?.comparison ?? 0)}% ${(dna?.comparison ?? 0) < 0 ? 'below' : 'above'}** the sector average.`;
  }

  if (q.match(/carbon credit|credit|tco2|offset/)) {
    return `💰 ${org} has accumulated **${cc?.credits ?? 0} tCO₂e** in carbon credits worth **₹${cc?.valueINR?.toLocaleString() ?? 0}**.\n\nYou can sell or retire these credits on the **Carbon Credit Marketplace**. Navigate to Marketplace → Sell Credits to list them.`;
  }

  if (q.match(/esg|score|rating|sustainability/)) {
    return `📊 Your current ESG score is **${cc?.esgScore ?? 'N/A'}/100**.\n\n${(cc?.esgScore ?? 0) >= 80 ? '🟢 Excellent! You\'re in the top green tier.' : (cc?.esgScore ?? 0) >= 70 ? '🟡 Good standing — a few improvements can push you to the top tier.' : '🔴 Below benchmark — focus on renewable adoption and energy efficiency.'}\n\nKey areas to improve: reduce peak-hour consumption and increase renewable share.`;
  }

  if (q.match(/reduce|saving|tip|improve|recommend/)) {
    const tips = dna?.recommendations ?? [];
    if (tips.length) {
      return `💡 Top recommendations for ${org}:\n\n${tips.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n')}`;
    }
    return `💡 General tips: switch to LED lighting, optimize HVAC schedules, and install solar panels to reduce grid dependency.`;
  }

  if (q.match(/solar|renewable|green energy/)) {
    const passive = data?.passive;
    return `☀️ ${org} is generating **${passive?.solarGen ?? 0} kWh** from solar today at **${passive?.solarEff ?? 0}% efficiency**.\n\nHeat recovered: **${passive?.heatRecovered ?? 0} kWh**. Motion-based savings: **${passive?.motionSaved ?? 0} kWh**. Building occupancy today: **${passive?.occupancyPct ?? 0}%**.`;
  }

  if (q.match(/alert|warning|critical|issue/)) {
    const alerts = data?.alerts ?? [];
    const critical = alerts.filter(a => a.level === 'critical');
    if (critical.length) {
      return `🚨 You have **${critical.length} critical alert${critical.length > 1 ? 's' : ''}**:\n\n${critical.map(a => `• ${a.msg}`).join('\n')}\n\nNavigate to **Alerts & Recommendations** for full details.`;
    }
    return `✅ No critical alerts right now. Check the Alerts panel for warnings and info messages.`;
  }

  if (q.match(/marketplace|buy|sell|trade/)) {
    return `🏪 The **Carbon Credit Marketplace** lets you:\n\n• **Buy** verified credits from renewable projects (wind, solar, forestry)\n• **Sell** your earned credits to other organizations\n• **Retire** credits for ESG reporting\n\nNavigate to the Marketplace section using the left sidebar!`;
  }

  if (q.match(/cost|bill|expense|money|rupee|inr/)) {
    return `💰 Today's energy cost for ${org} is **₹${live?.cost?.toLocaleString() ?? 'N/A'}**.\n\nThe biggest cost driver is **${dna?.energyBreakdown?.[0]?.name ?? 'Cooling'}** (${dna?.energyBreakdown?.[0]?.value ?? 0}% of consumption). Shifting peak loads and increasing renewable share are the fastest ways to reduce costs.`;
  }

  if (q.match(/hello|hi|hey|help|what can you/)) {
    return `👋 Hi ${user?.name?.split(' ')[0] ?? 'there'}! I'm your **EcoSense AI Assistant**.\n\nI can help you with:\n• Energy usage & cost analysis\n• Carbon emissions & credits\n• ESG scores & sustainability tips\n• Marketplace guidance\n• Energy-saving recommendations\n\nWhat would you like to know?`;
  }

  if (q.match(/sector|industry|type|profile/)) {
    const labels = { hospital: 'Healthcare', datacenter: 'Data Center', enterprise: 'Enterprise', school: 'Education (School)', college: 'Education (College)', factory: 'Manufacturing' };
    return `🏢 ${org} is a **${labels[sector] ?? sector}** sector organization.\n\nKey profile:\n• Peak hours: **${dna?.peakHour ?? 'N/A'}**\n• Base load: **${dna?.baseLoad ?? 'N/A'}**\n• Cooling dependency: **${dna?.coolingDep ?? 'N/A'}**\n• Sector comparison: **${Math.abs(dna?.comparison ?? 0)}% ${(dna?.comparison ?? 0) < 0 ? 'below' : 'above'}** average`;
  }

  return `🤖 I can help you with energy insights, carbon credits, ESG scores, and sustainability tips for **${org}**.\n\nTry asking:\n• "What is my energy usage?"\n• "How can I reduce emissions?"\n• "What is my ESG score?"`;
}

export default function Chatbot({ data }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'bot',
      text: `👋 Hi! I'm your **EcoSense AI** assistant. Ask me about energy usage, carbon credits, ESG scores, or sustainability tips for **${user?.org ?? 'your organization'}**.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    setTimeout(() => {
      const reply = buildResponse(q, user, data);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 400);
  };

  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={line === '' ? 'mt-1' : ''}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-semibold text-emerald-300">{part}</strong> : part
          )}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-gray-700 hover:bg-gray-600 rotate-0'
            : 'bg-gradient-to-br from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 animate-bounce-slow'
        }`}
        style={{ boxShadow: open ? undefined : '0 0 0 4px rgba(16,185,129,0.2), 0 8px 32px rgba(16,185,129,0.3)' }}
        title={open ? 'Close chat' : 'Ask EcoSense AI'}
      >
        {open ? <X size={20} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '70vh', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.15)' }}>

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600/30 to-cyan-600/20 border-b border-gray-700/60 px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Leaf size={15} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">EcoSense AI</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" />
                Carbon Intelligence Assistant
              </p>
            </div>
            <Sparkles size={14} className="text-emerald-400 flex-shrink-0" />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'bot' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {msg.role === 'bot' ? <Bot size={13} /> : <User size={13} />}
                </div>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed space-y-0.5 ${
                  msg.role === 'bot'
                    ? 'bg-gray-800 text-gray-200 rounded-tl-none'
                    : 'bg-emerald-600/80 text-white rounded-tr-none'
                }`}>
                  {renderText(msg.text)}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-emerald-400" />
                </div>
                <div className="bg-gray-800 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTED.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-700/60 px-3 py-2.5 flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Ask about energy, CO₂, credits..."
              className="flex-1 bg-gray-800 text-gray-200 placeholder-gray-500 text-xs rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
