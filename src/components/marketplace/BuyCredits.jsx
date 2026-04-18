import { useState } from 'react';
import { MARKET_PROJECTS } from '../../data/marketplaceData';
import { useMarketplace } from '../../context/MarketplaceContext';
import {
  ShoppingCart, Search, Filter, TrendingUp, Shield, Star,
  ChevronDown, Check, X, Plus, Minus
} from 'lucide-react';

const CERT_COLORS = {
  'Verra VCS': 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/30',
  'Gold Standard': 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800/30',
};

function BuyModal({ project, onClose, onBuy }) {
  const { wallet } = useMarketplace();
  const [qty, setQty] = useState(10);
  const [bidMode, setBidMode] = useState(false);
  const [bidPrice, setBidPrice] = useState(project.pricePerCredit);
  const [success, setSuccess] = useState(false);

  const total = (bidMode ? bidPrice : project.pricePerCredit) * qty;
  const canAfford = wallet.fundsBalance >= total;

  const handleBuy = () => {
    const result = onBuy(project, qty);
    if (result?.ok) setSuccess(true);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-sm w-full text-center border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Purchase Confirmed!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{qty} credits from <strong>{project.name}</strong></p>
          <p className="text-sm font-bold text-green-600 dark:text-green-400 mb-6">+{qty} tCO₂e added to your wallet</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-500 transition-colors">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-5 rounded-t-2xl flex items-center justify-between">
          <div>
            <div className="text-xl font-black text-white">{project.emoji} {project.name}</div>
            <div className="text-xs text-green-200 mt-0.5">{project.sector} · {project.certification}</div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setBidMode(false)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!bidMode ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              Buy Now ₹{project.pricePerCredit.toLocaleString()}
            </button>
            <button onClick={() => setBidMode(true)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${bidMode ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
              Place Bid
            </button>
          </div>

          {bidMode && (
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Your Bid Price (₹/tCO₂e)</label>
              <input type="number" value={bidPrice} onChange={e => setBidPrice(Number(e.target.value))} min={1000} max={2500}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30" />
              <div className="text-xs text-gray-400 mt-1">Market: ₹{project.pricePerCredit} · Your bid must be reasonable to match</div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-2">Quantity (tCO₂e)</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 10))}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Minus size={14} />
              </button>
              <input type="number" value={qty} onChange={e => setQty(Math.max(1, Math.min(project.available, Number(e.target.value))))}
                className="flex-1 text-center px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:border-green-500" />
              <button onClick={() => setQty(q => Math.min(project.available, q + 10))}
                className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">{project.available.toLocaleString()} credits available</div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Price per credit</span><span>₹{(bidMode ? bidPrice : project.pricePerCredit).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Quantity</span><span>{qty} tCO₂e</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-sm text-gray-900 dark:text-white">
              <span>Total</span><span>₹{total.toLocaleString()}</span>
            </div>
            <div className={`text-xs ${canAfford ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
              Wallet: ₹{wallet.fundsBalance.toLocaleString()} {canAfford ? '(sufficient)' : '(insufficient)'}
            </div>
          </div>

          <button onClick={handleBuy} disabled={!canAfford}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {bidMode ? `Place Bid — ₹${total.toLocaleString()}` : `Confirm Purchase — ₹${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuyCredits() {
  const { buyCredits } = useMarketplace();
  const [search, setSearch] = useState('');
  const [certFilter, setCertFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const CERTS = ['All', 'Verra VCS', 'Gold Standard'];
  const SECTORS = ['All', 'Solar Energy', 'Wind Energy', 'Biogas', 'Blue Carbon', 'Forestry (REDD+)', 'Clean Transport'];
  const PRICE_RANGES = ['All', 'Under ₹1,400', '₹1,400–₹1,600', 'Over ₹1,600'];

  const filtered = MARKET_PROJECTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchCert = certFilter === 'All' || p.certification === certFilter;
    const matchSector = sectorFilter === 'All' || p.sector === sectorFilter;
    const matchPrice = priceFilter === 'All' ||
      (priceFilter === 'Under ₹1,400' && p.pricePerCredit < 1400) ||
      (priceFilter === '₹1,400–₹1,600' && p.pricePerCredit >= 1400 && p.pricePerCredit <= 1600) ||
      (priceFilter === 'Over ₹1,600' && p.pricePerCredit > 1600);
    return matchSearch && matchCert && matchSector && matchPrice;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {selectedProject && (
        <BuyModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onBuy={(project, qty) => { const r = buyCredits(project, qty); return r; }}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">Buy Credits Marketplace</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{MARKET_PROJECTS.length} verified projects · {MARKET_PROJECTS.reduce((s, p) => s + p.available, 0).toLocaleString()} credits available</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Live Market</span>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search projects, locations…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20" />
        </div>
        {/* Filter dropdowns */}
        {[
          { label: certFilter === 'All' ? 'Certification' : certFilter, options: CERTS, set: setCertFilter },
          { label: sectorFilter === 'All' ? 'Sector' : sectorFilter, options: SECTORS, set: setSectorFilter },
          { label: priceFilter === 'All' ? 'Price Range' : priceFilter, options: PRICE_RANGES, set: setPriceFilter },
        ].map((f, i) => (
          <div key={i} className="relative group">
            <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 hover:border-green-400 transition-colors whitespace-nowrap">
              <Filter size={13} /> {f.label} <ChevronDown size={13} />
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-20 hidden group-hover:block">
              {f.options.map(o => (
                <button key={o} onClick={() => f.set(o)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-xl last:rounded-b-xl flex items-center justify-between">
                  {o}
                  {((i === 0 && certFilter === o) || (i === 1 && sectorFilter === o) || (i === 2 && priceFilter === o)) && <Check size={12} className="text-green-600 dark:text-green-400" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(p => {
          const soldPct = Math.round((p.sold / p.totalIssued) * 100);
          return (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden group">
              {/* Card header */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 px-5 pt-5 pb-4 relative">
                {p.trending && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                    <TrendingUp size={10} /> Trending
                  </div>
                )}
                <div className="text-5xl mb-3">{p.emoji}</div>
                <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{p.location} · Vintage {p.vintage}</p>
              </div>

              <div className="px-5 pb-5 space-y-4">
                {/* Cert + rating */}
                <div className="flex items-center gap-2 pt-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${CERT_COLORS[p.certification] || ''}`}>
                    {p.certification}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold ml-auto">
                    <Star size={11} fill="currentColor" /> {p.rating}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{p.description}</p>

                {/* Availability bar */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{p.available.toLocaleString()} available</span>
                    <span>{soldPct}% sold</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-1000 ${soldPct > 80 ? 'bg-red-500' : soldPct > 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${soldPct}%` }} />
                  </div>
                </div>

                {/* Price + SDGs */}
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-xl font-black text-gray-900 dark:text-white">₹{p.pricePerCredit.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">per tCO₂e · SDG {p.sdgGoals.join(', ')}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={12} className="text-green-600 dark:text-green-400" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Verified</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => setSelectedProject(p)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm font-bold transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-1.5">
                    <ShoppingCart size={14} /> Buy Now
                  </button>
                  <button onClick={() => setSelectedProject({ ...p, bidMode: true })}
                    className="px-3 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    Bid
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-600">
          <Search size={40} className="mx-auto mb-2" />
          <div className="text-sm">No projects match your filters. Try adjusting the criteria.</div>
        </div>
      )}
    </div>
  );
}
