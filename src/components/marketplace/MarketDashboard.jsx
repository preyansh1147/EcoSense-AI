import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useAuth } from '../../context/AuthContext';
import {
  TrendingUp, TrendingDown, Leaf, DollarSign, BarChart2,
  ArrowUpRight, ArrowDownRight, Zap, Activity, ShoppingCart, Tag
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, BarChart, Bar
} from 'recharts';
import { PRICE_HISTORY, SECTOR_PRICES } from '../../data/marketplaceData';

function useCounter(target) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let s = 0;
    const step = target / (1200 / 16);
    const t = setInterval(() => {
      s = Math.min(s + step, target);
      setVal(Math.floor(s));
      if (s >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return val;
}

function KpiCard({ icon: Icon, label, value, prefix = '', suffix = '', change, changeUp, color, sub }) {
  const num = useCounter(typeof value === 'number' ? value : 0);
  const colorMap = {
    green: 'from-green-400 to-green-600 shadow-green-500/20',
    blue: 'from-blue-400 to-blue-600 shadow-blue-500/20',
    purple: 'from-purple-400 to-purple-600 shadow-purple-500/20',
    orange: 'from-orange-400 to-orange-600 shadow-orange-500/20',
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm card-hover group relative overflow-hidden">
      <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: `radial-gradient(circle, ${color === 'green' ? '#16A34A' : color === 'blue' ? '#2563EB' : color === 'purple' ? '#9333EA' : '#EA580C'}, transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.green} shadow-lg flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${changeUp ? 'text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400' : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'}`}>
            {changeUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}%
          </div>
        )}
      </div>
      <div className="text-2xl font-black text-gray-900 dark:text-white">
        {prefix}{typeof value === 'number' ? num.toLocaleString() : value}{suffix}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
      {sub && <div className="text-[11px] text-gray-300 dark:text-gray-600 mt-0.5">{sub}</div>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs">
        <div className="text-gray-300 mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} className="text-white font-bold">₹{p.value.toLocaleString()}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MarketDashboard() {
  const { wallet, transactions } = useMarketplace();
  const { user } = useAuth();
  const navigate = useNavigate();

  const recent = transactions.slice(0, 4);
  const txTypeBadge = { buy: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400', sell: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400', retire: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">
            Welcome back, {user?.name} 👋
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your carbon credit portfolio at a glance</p>
        </div>
        {/* Live price chip */}
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 rounded-2xl px-4 py-2">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50" />
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-none">Live Market Price</div>
            <div className="text-lg font-black text-green-700 dark:text-green-400">₹{wallet.marketPrice.toLocaleString()}<span className="text-xs font-normal text-gray-400">/tCO₂e</span></div>
          </div>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-bold">
            <TrendingUp size={14} /> +{wallet.priceChange}%
          </div>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Leaf} label="Credits Owned" value={wallet.creditsOwned} suffix=" tCO₂e" change={4.3} changeUp color="green" sub="In wallet, ready to sell" />
        <KpiCard icon={Tag} label="Credits Sold" value={wallet.creditsSold} suffix=" tCO₂e" change={12.1} changeUp color="blue" sub="Total lifetime sales" />
        <KpiCard icon={DollarSign} label="Revenue Earned" value={wallet.revenueEarned} prefix="₹" change={8.7} changeUp color="purple" sub="After platform commission" />
        <KpiCard icon={BarChart2} label="Wallet Balance" value={wallet.fundsBalance} prefix="₹" change={2.1} changeUp color="orange" sub="Available to spend" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Price chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Market Price — 18 Days</div>
              <div className="text-xs text-gray-400">VCM India Index (₹/tCO₂e)</div>
            </div>
            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold">
              <TrendingUp size={14} /> ₹{wallet.marketPrice}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={PRICE_HISTORY}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[1460, 1600]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#16A34A" strokeWidth={2.5} fill="url(#priceGrad)" dot={false} activeDot={{ r: 5, fill: '#16A34A', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sector prices */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-4">Sector Prices</div>
          <div className="space-y-2.5">
            {SECTOR_PRICES.map(s => (
              <div key={s.sector} className="flex items-center gap-3">
                <div className="flex-1 text-xs text-gray-600 dark:text-gray-400 font-medium">{s.sector}</div>
                <div className="text-xs font-bold text-gray-900 dark:text-white">₹{s.price.toLocaleString()}</div>
                <div className={`text-xs font-bold flex items-center gap-0.5 ${s.up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {s.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {s.change}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Volume bar chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-4">Daily Trading Volume (credits)</div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={PRICE_HISTORY}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6', fontSize: 11 }} />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]} fill="#2563EB" opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: ShoppingCart, label: 'Buy Credits',  path: '/marketplace/buy',          color: 'bg-blue-600 hover:bg-blue-500',     shadow: 'shadow-blue-600/20' },
          { icon: Tag,          label: 'Sell Credits', path: '/marketplace/sell',         color: 'bg-green-600 hover:bg-green-500',   shadow: 'shadow-green-600/20' },
          { icon: Activity,     label: 'AI Insights',  path: '/marketplace/insights',     color: 'bg-purple-600 hover:bg-purple-500', shadow: 'shadow-purple-600/20' },
          { icon: BarChart2,    label: 'Transactions', path: '/marketplace/transactions', color: 'bg-orange-500 hover:bg-orange-400', shadow: 'shadow-orange-500/20' },
        ].map(a => (
          <button key={a.path} onClick={() => navigate(a.path)}
            className={`${a.color} ${a.shadow} text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg hover:scale-105`}>
            <a.icon size={16} /> {a.label}
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900 dark:text-white">Recent Transactions</div>
          <button onClick={() => navigate('/marketplace/transactions')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View all →</button>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {recent.map(tx => (
            <div key={tx.id} className="px-5 py-3 flex items-center gap-4">
              <div className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${txTypeBadge[tx.type] || txTypeBadge.buy}`}>{tx.type}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{tx.project}</div>
                <div className="text-xs text-gray-400">{tx.credits} tCO₂e @ ₹{tx.price?.toLocaleString()}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-sm font-bold text-gray-900 dark:text-white">₹{tx.total?.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{tx.date}</div>
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                tx.status === 'completed' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                tx.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' :
                'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
              }`}>{tx.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
