import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { calcSuggestedPrice, COMMISSION_RATES } from '../../data/marketplaceData';
import {
  Tag, Zap, Info, AlertTriangle, Check, ChevronDown, Sparkles
} from 'lucide-react';

const CERTS = ['Verra VCS', 'Gold Standard', 'Unverified'];
const SECTORS = [
  { key: 'solar', label: 'Solar Energy' },
  { key: 'wind', label: 'Wind Energy' },
  { key: 'biogas', label: 'Biogas' },
  { key: 'blue', label: 'Blue Carbon' },
  { key: 'forest', label: 'Forestry (REDD+)' },
  { key: 'transport', label: 'Clean Transport' },
];

const STATUS_BADGE = {
  active: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  sold: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
  cancelled: 'bg-gray-50 dark:bg-gray-800 text-gray-500',
};

export default function SellCredits() {
  const { wallet, listings, sellCredits } = useMarketplace();

  const [credits, setCredits] = useState(10);
  const [price, setPrice] = useState(1580);
  const [cert, setCert] = useState('Verra VCS');
  const [sector, setSector] = useState('solar');
  const [useAiPrice, setUseAiPrice] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const aiPrice = calcSuggestedPrice(cert, sector, 1.2);
  const activePrice = useAiPrice ? aiPrice : price;
  const commRate = COMMISSION_RATES[cert] ?? 0.15;
  const commission = Math.round(activePrice * credits * commRate);
  const net = activePrice * credits - commission;

  const handleSell = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    const res = sellCredits({ credits, price: activePrice, cert, sectorKey: sector });
    setResult(res);
    setSubmitting(false);
  };

  const dismissResult = () => setResult(null);

  const certColor = { 'Verra VCS': 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400', 'Gold Standard': 'border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-500', 'Unverified': 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400' };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Success / error toast */}
      {result && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border animate-in ${result.ok ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          {result.ok ? <Check size={18} className="text-green-600 dark:text-green-400 flex-shrink-0" /> : <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />}
          <div className="flex-1">
            {result.ok
              ? <><div className="text-sm font-bold text-green-700 dark:text-green-400">Listing Created Successfully!</div>
                  <div className="text-xs text-green-600/80 dark:text-green-400/70">Commission: ₹{result.commission?.toLocaleString()} · Net you receive: ₹{result.net?.toLocaleString()}</div></>
              : <div className="text-sm font-medium text-red-600">{result.msg}</div>
            }
          </div>
          <button onClick={dismissResult} className="text-gray-400 hover:text-gray-600"><ChevronDown size={16} /></button>
        </div>
      )}

      <div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white">Sell Carbon Credits</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">List your verified credits on the marketplace with AI-optimised pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSell} className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
          {/* Wallet balance */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/15 border border-green-100 dark:border-green-800/30">
            <Tag size={16} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Wallet Balance</div>
              <div className="text-base font-black text-green-700 dark:text-green-400">{wallet.creditsOwned} tCO₂e available to sell</div>
            </div>
          </div>

          {/* Credits to sell */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Credits to List (tCO₂e)</label>
            <input type="number" min={1} max={wallet.creditsOwned} value={credits}
              onChange={e => setCredits(Math.max(1, Math.min(wallet.creditsOwned, Number(e.target.value))))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20" />
            <div className="text-xs text-gray-400 mt-1">Max: {wallet.creditsOwned} credits</div>
          </div>

          {/* Certification */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Certification Standard</label>
            <div className="grid grid-cols-3 gap-2">
              {CERTS.map(c => (
                <button key={c} type="button" onClick={() => setCert(c)}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center ${cert === c ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 ring-1 ring-green-500/30' : `${certColor[c]} bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800`}`}>
                  {c}
                  {c !== 'Unverified' && <div className="text-[10px] font-normal mt-0.5">+{c === 'Gold Standard' ? '15%' : '10%'} premium</div>}
                </button>
              ))}
            </div>
          </div>

          {/* Sector */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-2">Project Sector</label>
            <div className="grid grid-cols-3 gap-2">
              {SECTORS.map(s => (
                <button key={s.key} type="button" onClick={() => setSector(s.key)}
                  className={`py-2 px-2 rounded-xl border text-xs font-medium transition-all ${sector === s.key ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Price */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Listing Price (₹/tCO₂e)</label>
              <button type="button" onClick={() => setUseAiPrice(p => !p)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${useAiPrice ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500'}`}>
                <Sparkles size={11} /> {useAiPrice ? 'AI Price: ON' : 'AI Price: OFF'}
              </button>
            </div>
            {useAiPrice ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/15 border border-purple-100 dark:border-purple-800/30">
                <Zap size={16} className="text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xl font-black text-purple-700 dark:text-purple-400">₹{aiPrice.toLocaleString()}</div>
                  <div className="text-xs text-purple-500/80 dark:text-purple-400/60">AI-optimised: Base ₹1,200 × cert({cert === 'Gold Standard' ? '1.15' : '1.10'}) × sector({SECTORS.find(s => s.key === sector)?.label}) × demand(1.2)</div>
                </div>
              </div>
            ) : (
              <input type="number" min={800} max={5000} value={price} onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:border-green-500" />
            )}
          </div>

          <button type="submit" disabled={submitting || credits < 1}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-lg shadow-green-600/20 disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Tag size={16} />}
            {submitting ? 'Creating Listing…' : `List ${credits} Credits for ₹${(activePrice * credits).toLocaleString()}`}
          </button>
        </form>

        {/* Summary panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Commission breakdown */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info size={14} className="text-blue-600 dark:text-blue-400" />
              <div className="text-sm font-bold text-gray-900 dark:text-white">Commission Breakdown</div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Credits', value: `${credits} tCO₂e` },
                { label: 'Price per credit', value: `₹${activePrice.toLocaleString()}` },
                { label: 'Gross value', value: `₹${(activePrice * credits).toLocaleString()}` },
                { label: `Platform commission (${Math.round(commRate * 100)}%)`, value: `-₹${commission.toLocaleString()}`, red: true },
              ].map(r => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{r.label}</span>
                  <span className={`font-semibold ${r.red ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{r.value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">You receive</span>
                <span className="text-lg font-black text-green-600 dark:text-green-400">₹{net.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Commission tiers info */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-4">
            <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Commission Rate Tiers</div>
            <div className="space-y-1.5">
              {[['Verra VCS', '10%'], ['Gold Standard', '12%'], ['Unverified', '15%']].map(([c, r]) => (
                <div key={c} className={`flex justify-between text-xs ${cert === c ? 'font-bold text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  <span>{c}</span><span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active listings */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Your Active Listings</div>
          <div className="text-xs text-gray-400">{listings.filter(l => l.status === 'active').length} active</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {['Listing ID', 'Credits', 'Price', 'Gross', 'Commission', 'Net', 'Cert', 'Status', 'Listed'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {listings.map(l => (
                <tr key={l.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{l.id}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{l.credits}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{l.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">₹{(l.credits * l.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-red-500">{l.commissionPct}%</td>
                  <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">₹{Math.round(l.credits * l.price * (1 - l.commissionPct / 100)).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{l.cert}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_BADGE[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{l.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
