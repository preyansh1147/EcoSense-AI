import { useState } from 'react';
import { calcSuggestedPrice, COMMISSION_RATES } from '../../data/marketplaceData';
import { ArrowRight, Leaf, Shield, BarChart2, DollarSign, Lock, Check, Info, Zap } from 'lucide-react';

// Animated flow node
function FlowNode({ icon: Icon, label, sub, color, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center gap-2 cursor-pointer group transition-all duration-200 ${active ? 'scale-105' : 'hover:scale-105'}`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 ${color} ${active ? 'ring-2 ring-offset-2 ring-current' : ''}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-gray-900 dark:text-white">{label}</div>
        {sub && <div className="text-[10px] text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

const FLOW_STEPS = [
  {
    id: 'project',
    icon: Leaf,
    label: 'Climate Project',
    sub: 'Solar/Wind/Forest',
    color: 'bg-gradient-to-br from-green-500 to-green-700 shadow-green-500/30',
    title: '1. Climate Project Creates Credits',
    detail: `A verified climate project proves it has avoided or removed CO₂ from the atmosphere.

Examples:
• Solar farm displaces coal (avoidance)
• Reforestation absorbs CO₂ (removal)  
• Biogas replaces LPG (fuel switching)

Required proof: Measurable, verifiable, permanent, and additional to business-as-usual.`,
    badge: '1 tCO₂e avoided = 1 raw credit',
  },
  {
    id: 'verify',
    icon: Shield,
    label: 'Verification',
    sub: 'Verra / Gold Standard',
    color: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30',
    title: '2. Independent Verification & Certification',
    detail: `Third-party auditors validate the emission reductions:

• Verra VCS (Voluntary Carbon Standard): Global standard, stringent methodology
• Gold Standard: Highest quality, ensures SDG co-benefits
• Auditors visit the site, review MRV data, and issue carbon credits with unique serial numbers

Credits are registered in a public registry — fully traceable.`,
    badge: 'Every credit has a unique serial number',
  },
  {
    id: 'wallet',
    icon: DollarSign,
    label: 'Seller Wallet',
    sub: '+Credits issued',
    color: 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/30',
    title: '3. Credits Enter Seller Wallet',
    detail: `After verification, certified credits are issued to the seller's wallet.

Wallet holds:
• Number of credits (tCO₂e)
• Certification type (Verra/Gold)
• Vintage year
• Project metadata

Credits can then be listed on the marketplace or retired directly for offset claims.`,
    badge: 'Credits in wallet = tradeable assets',
  },
  {
    id: 'market',
    icon: BarChart2,
    label: 'Marketplace',
    sub: 'AI-priced listing',
    color: 'bg-gradient-to-br from-orange-500 to-orange-700 shadow-orange-500/30',
    title: '4. Trading on the Marketplace',
    detail: `Seller lists credits with an AI-suggested price:

Pricing Formula:
  Suggested Price = Base × Cert Multiplier × Sector Premium × AI Demand Score

Where:
  • Base price: ₹1,200/tCO₂e (market floor)
  • Cert multiplier: Gold Standard 1.15×, Verra 1.10×
  • Sector premium: Biogas 1.18×, Solar 1.10×, Wind 1.05×
  • AI demand score: 1.0–1.5× (real-time market data)

Platform commission: 10–15% depending on certification.`,
    badge: 'Live price = ₹1,580/tCO₂e today',
  },
  {
    id: 'buyer',
    icon: Zap,
    label: 'Buyer Purchase',
    sub: 'Credits to wallet',
    color: 'bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-cyan-500/30',
    title: '5. Buyer Acquires Credits',
    detail: `A corporate buyer (hospital, data centre, manufacturer) purchases credits to:

  a) Offset their Scope 1/2/3 emissions
  b) Meet SEBI BRSR / CDP / GHG Protocol targets
  c) Speculate on price appreciation

After purchase:
  • Credits enter buyer's wallet
  • Transaction recorded on immutable ledger
  • Buyer can hold, resell, or retire the credits`,
    badge: 'Buyer pays ₹1,580 → receives 1 tCO₂e',
  },
  {
    id: 'retire',
    icon: Lock,
    label: 'Retirement',
    sub: 'Permanent offset',
    color: 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-500/30',
    title: '6. Retirement — Permanent Offset Claim',
    detail: `When a credit is "retired", it is permanently cancelled and can never be sold again.

Retirement means:
  • Organisation claims a verified offset of 1 tCO₂e
  • Credit serial number is permanently struck off the registry
  • ESG report can cite this retirement as evidence
  • Audit-ready: listed on public Verra/Gold Standard registry

This is the final step — turning a financial instrument into real climate action.`,
    badge: 'Retired = 1 tCO₂e permanently offset',
  },
];

// ── Pricing simulator ──
function PricingSimulator() {
  const [cert, setCert] = useState('Verra VCS');
  const [sector, setSector] = useState('solar');
  const [demand, setDemand] = useState(1.2);
  const [qty, setQty] = useState(50);

  const price = calcSuggestedPrice(cert, sector, demand);
  const commRate = COMMISSION_RATES[cert] ?? 0.15;
  const gross = price * qty;
  const commission = Math.round(gross * commRate);
  const net = gross - commission;

  const certMult = cert === 'Gold Standard' ? 1.15 : cert === 'Verra VCS' ? 1.10 : 1.0;
  const sectorMult = { solar: 1.10, wind: 1.05, biogas: 1.18, blue: 1.25, forest: 1.08, transport: 1.15 }[sector] || 1.0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={16} className="text-purple-600 dark:text-purple-400" />
        <div className="text-sm font-bold text-gray-900 dark:text-white">Live Pricing Simulator</div>
        <span className="ml-auto text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-full">Interactive</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {/* Certification */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Certification</label>
          <div className="space-y-1.5">
            {['Verra VCS', 'Gold Standard', 'Unverified'].map(c => (
              <button key={c} onClick={() => setCert(c)}
                className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${cert === c ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {c} <span className="float-right font-bold">{c === 'Gold Standard' ? '1.15×' : c === 'Verra VCS' ? '1.10×' : '1.00×'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Sector</label>
          <div className="space-y-1.5">
            {[['solar', 'Solar', '1.10×'], ['wind', 'Wind', '1.05×'], ['biogas', 'Biogas', '1.18×'], ['blue', 'Blue Carbon', '1.25×'], ['forest', 'Forest', '1.08×'], ['transport', 'Transport', '1.15×']].map(([k, l, m]) => (
              <button key={k} onClick={() => setSector(k)}
                className={`w-full text-left px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${sector === k ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                {l} <span className="float-right font-bold">{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Demand + qty */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">AI Demand Score: {demand}×</label>
            <input type="range" min={1.0} max={1.5} step={0.05} value={demand} onChange={e => setDemand(Number(e.target.value))}
              className="w-full accent-purple-600" />
            <div className="flex justify-between text-[10px] text-gray-400"><span>1.0× (low)</span><span>1.5× (high)</span></div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Quantity (tCO₂e)</label>
            <input type="number" min={1} max={5000} value={qty} onChange={e => setQty(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-purple-500" />
          </div>
        </div>
      </div>

      {/* Formula display */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 font-mono text-xs">
        <div className="text-gray-500 dark:text-gray-400 mb-2">Pricing Formula:</div>
        <div className="text-gray-900 dark:text-white">
          <span className="text-green-600 dark:text-green-400">₹{price}</span>
          {' = '}
          <span className="text-gray-500">₹1,200</span>
          {' × '}
          <span className="text-blue-600 dark:text-blue-400">{certMult}×</span>
          {' × '}
          <span className="text-orange-600 dark:text-orange-400">{sectorMult}×</span>
          {' × '}
          <span className="text-purple-600 dark:text-purple-400">{demand}×</span>
        </div>
        <div className="text-gray-400 text-[10px] mt-1">Base × Certification × Sector × AI Demand</div>
      </div>

      {/* Result */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Suggested Price', value: `₹${price.toLocaleString()}`, color: 'text-green-600 dark:text-green-400' },
          { label: `Gross (${qty} credits)`, value: `₹${gross.toLocaleString()}`, color: 'text-gray-900 dark:text-white' },
          { label: `Commission (${Math.round(commRate * 100)}%)`, value: `-₹${commission.toLocaleString()}`, color: 'text-red-500' },
          { label: 'You Receive', value: `₹${net.toLocaleString()}`, color: 'text-blue-600 dark:text-blue-400 font-black' },
        ].map(r => (
          <div key={r.label} className="text-center bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
            <div className={`text-base font-black ${r.color}`}>{r.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Wallet flow diagram ──
function WalletFlow() {
  const steps = [
    { label: 'Project', emoji: '🌳', value: '1,000 tCO₂e', desc: 'Raw avoided emissions' },
    { label: 'Verification', emoji: '🏅', value: '980 tCO₂e', desc: '2% adjustment for uncertainty' },
    { label: 'Wallet', emoji: '👛', value: '980 tCO₂e', desc: 'Issued to seller' },
    { label: 'Marketplace', emoji: '🏪', value: '900 tCO₂e', desc: '80 retired by seller' },
    { label: 'Buyer', emoji: '🏢', value: '900 tCO₂e', desc: 'Purchased at ₹1,580/cr' },
    { label: 'Retired', emoji: '🔒', value: '900 tCO₂e', desc: 'Permanently offset' },
  ];
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="text-sm font-bold text-gray-900 dark:text-white mb-4">Credit Wallet Flow Diagram</div>
      <div className="flex items-start gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-2 flex-shrink-0">
            <div className="text-center w-24">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-2xl mx-auto mb-2 hover:scale-110 transition-transform">{s.emoji}</div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{s.label}</div>
              <div className="text-[10px] font-bold text-green-600 dark:text-green-400 mt-0.5">{s.value}</div>
              <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{s.desc}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex items-center mt-4 text-gray-300 dark:text-gray-700">
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreditLogic() {
  const [activeStep, setActiveStep] = useState(0);

  const step = FLOW_STEPS[activeStep];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Carbon Credit Logic Dashboard</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Visual explainer of the complete carbon credit business lifecycle</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-800">
          <Shield size={12} /> GHG Protocol Compliant
        </div>
      </div>

      {/* Key definition */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-5 text-white">
        <div className="text-xs opacity-75 mb-1">Core Definition</div>
        <div className="text-2xl font-black mb-2">1 Carbon Credit = 1 tCO₂e</div>
        <div className="text-sm opacity-90 leading-relaxed">One tonne of carbon dioxide equivalent — avoided, reduced, or removed from the atmosphere by a verified climate project. Certified, serialised, and tradeable on voluntary carbon markets.</div>
      </div>

      {/* Interactive flow */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-5">Carbon Credit Lifecycle — Click any step to explore</div>
        <div className="flex items-start justify-between gap-2 overflow-x-auto pb-4 mb-6">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-start gap-2 flex-shrink-0">
              <FlowNode
                icon={s.icon} label={s.label} sub={s.sub} color={s.color}
                active={activeStep === i} onClick={() => setActiveStep(i)}
              />
              {i < FLOW_STEPS.length - 1 && (
                <div className="flex items-center mt-5 text-gray-200 dark:text-gray-700">
                  <div className="w-6 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <ArrowRight size={14} className="text-gray-400 dark:text-gray-600 -ml-1" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step detail */}
        <div className={`rounded-xl p-5 border transition-all duration-300 ${FLOW_STEPS[activeStep].color.includes('green') ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' : FLOW_STEPS[activeStep].color.includes('blue') ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30' : FLOW_STEPS[activeStep].color.includes('purple') ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30' : FLOW_STEPS[activeStep].color.includes('orange') ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30' : FLOW_STEPS[activeStep].color.includes('cyan') ? 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800/30' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30'}`}>
          <h4 className="text-base font-black text-gray-900 dark:text-white mb-2">{step.title}</h4>
          <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed font-sans">{step.detail}</pre>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300">
            <Check size={11} className="text-green-600 dark:text-green-400" /> {step.badge}
          </div>
        </div>
      </div>

      {/* Compliance badges */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-4">Compliance & Standards Supported</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Verra VCS', desc: 'Voluntary Carbon Standard', icon: '🌍' },
            { name: 'Gold Standard', desc: 'Quality & SDG certified', icon: '🏅' },
            { name: 'GHG Protocol', desc: 'Scope 1, 2 & 3', icon: '📊' },
            { name: 'SEBI BRSR', desc: 'India ESG disclosure', icon: '🇮🇳' },
            { name: 'CDP Disclosure', desc: 'Climate transparency', icon: '🌿' },
            { name: 'ISO 14064', desc: 'Greenhouse gas standard', icon: '⚖️' },
          ].map(b => (
            <div key={b.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="text-2xl">{b.icon}</div>
              <div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">{b.name}</div>
                <div className="text-[10px] text-gray-400">{b.desc}</div>
              </div>
              <Check size={14} className="text-green-600 dark:text-green-400 ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive pricing simulator */}
      <PricingSimulator />

      {/* Wallet flow */}
      <WalletFlow />
    </div>
  );
}
