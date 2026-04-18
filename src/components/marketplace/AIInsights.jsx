import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { AI_RECOMMENDATIONS, PRICE_HISTORY, SECTOR_PRICES } from '../../data/marketplaceData';
import {
  TrendingUp, TrendingDown, Activity, Zap, AlertTriangle, ArrowUpRight,
  ArrowDownRight, BarChart2, ChevronRight
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine
} from 'recharts';

const ACTION_CONFIG = {
  SELL: { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', btn: 'bg-green-600 hover:bg-green-500', dot: 'bg-green-500' },
  HOLD: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800', btn: 'bg-amber-500 hover:bg-amber-400', dot: 'bg-amber-500' },
  BUY: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', btn: 'bg-blue-600 hover:bg-blue-500', dot: 'bg-blue-500' },
};

// Simulated forecast data
const FORECAST = [
  ...PRICE_HISTORY.slice(-5),
  { date: 'Apr 19', price: 1592, forecast: true },
  { date: 'Apr 20', price: 1605, forecast: true },
  { date: 'Apr 21', price: 1618, forecast: true },
  { date: 'Apr 22', price: 1628, forecast: true },
  { date: 'Apr 23', price: 1640, forecast: true },
  { date: 'Apr 25', price: 1655, forecast: true },
  { date: 'Apr 28', price: 1670, forecast: true },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs">
        <div className="text-gray-400 mb-1">{label}</div>
        <div className="text-white font-bold">₹{payload[0]?.value?.toLocaleString()}</div>
        {payload[0]?.payload?.forecast && <div className="text-purple-400 text-[10px]">AI Forecast</div>}
      </div>
    );
  }
  return null;
};

export default function AIInsights() {
  const { wallet } = useMarketplace();
  const [activeRec, setActiveRec] = useState(0);

  const historicalPart = FORECAST.filter(d => !d.forecast);
  const forecastPart = FORECAST.filter(d => d.forecast);

  // Risk meter
  const marketSentiment = 72; // 0-100
  const volatility = 18;

  const MARKET_SIGNALS = [
    { label: 'Demand Signal', value: 'High', icon: TrendingUp, color: 'text-green-600 dark:text-green-400', note: 'Q2 ESG filing demand surge' },
    { label: 'Supply Pressure', value: 'Low', icon: TrendingDown, color: 'text-blue-600 dark:text-blue-400', note: 'Limited new project credits' },
    { label: 'Regulatory Outlook', value: 'Bullish', icon: Activity, color: 'text-purple-600 dark:text-purple-400', note: 'SEBI BRSR mandate expands' },
    { label: 'Market Volatility', value: `${volatility}%`, icon: AlertTriangle, color: volatility > 25 ? 'text-red-500' : 'text-amber-500', note: '30-day rolling volatility' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white">AI Insights & Market Intelligence</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">ML-powered price forecasts and portfolio recommendations</p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-full border border-purple-100 dark:border-purple-800">
          <Zap size={12} /> AI Engine Active
        </div>
      </div>

      {/* Market signals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MARKET_SIGNALS.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
            <s.icon size={16} className={`${s.color} mb-2`} />
            <div className={`text-base font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Price forecast chart */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-sm font-bold text-gray-900 dark:text-white">Price Forecast — Next 10 Days</div>
            <div className="text-xs text-gray-400">Historical + AI projection (₹/tCO₂e)</div>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-green-500 rounded" />Historical</div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-1 bg-purple-500 rounded border-dashed border border-purple-500" />AI Forecast</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={FORECAST}>
            <defs>
              <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="forecastGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333EA" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#9333EA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[1550, 1700]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="Apr 18" stroke="#ef4444" strokeDasharray="4 3" label={{ value: 'Today', fill: '#ef4444', fontSize: 10 }} />
            {/* Historical segment */}
            <Area dataKey="price" type="monotone" stroke="#16A34A" strokeWidth={2.5}
              fill="url(#histGrad)" dot={false} activeDot={{ r: 4, fill: '#16A34A' }} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-800/30 text-xs text-purple-700 dark:text-purple-400">
          🤖 <strong>AI Projection:</strong> Market expected to reach ₹1,650–₹1,680 by Apr 28 (+5.7%) driven by Q2 ESG filing demand and Verra supply constraints.
        </div>
      </div>

      {/* Sector comparison */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-4">Sector Performance (7-day change)</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={SECTOR_PRICES} layout="vertical" margin={{ left: 40 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis dataKey="sector" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6', fontSize: 11 }}
              formatter={v => [`+${v}%`]} />
            <Bar dataKey="change" radius={[0, 6, 6, 0]} fill="#16A34A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">AI Portfolio Recommendations</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AI_RECOMMENDATIONS.map((rec, i) => {
            const C = ACTION_CONFIG[rec.action];
            return (
              <div key={rec.id} onClick={() => setActiveRec(i)}
                className={`border rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 ${C.bg} ${activeRec === i ? 'ring-2 ring-offset-1 ring-current shadow-lg' : 'shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${C.dot} animate-pulse`} />
                  <div className={`text-lg font-black ${C.color}`}>{rec.action}</div>
                  <div className="ml-auto text-xs font-bold text-gray-500 dark:text-gray-400">
                    {rec.confidence}% confidence
                  </div>
                </div>

                {/* Confidence bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
                  <div className="h-1.5 rounded-full transition-all duration-1000 bg-current"
                    style={{ width: `${rec.confidence}%`, color: C.dot.replace('bg-', '') === 'green-500' ? '#16A34A' : C.dot.replace('bg-', '') === 'blue-500' ? '#2563EB' : '#F59E0B' }} />
                </div>

                <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">{rec.asset}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{rec.reasoning}</p>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price Target</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{rec.priceTarget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Timeframe</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{rec.timeframe}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level</span>
                    <span className={`font-bold ${rec.risk === 'Low' ? 'text-green-600 dark:text-green-400' : rec.risk === 'Medium' ? 'text-amber-500' : 'text-red-500'}`}>{rec.risk}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Market sentiment meter */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="text-sm font-bold text-gray-900 dark:text-white mb-4">Market Sentiment Meter</div>
        <div className="relative pt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Bearish</span><span>Neutral</span><span>Bullish</span>
          </div>
          <div className="w-full bg-gradient-to-r from-red-300 via-amber-300 to-green-400 rounded-full h-4 relative overflow-hidden">
            <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-gray-800 rounded-full shadow-lg transition-all duration-1000"
              style={{ left: `calc(${marketSentiment}% - 10px)` }} />
          </div>
          <div className="text-center mt-3">
            <div className="text-2xl font-black text-green-600 dark:text-green-400">{marketSentiment}/100</div>
            <div className="text-xs text-gray-500 mt-0.5">Overall market sentiment — Moderately Bullish</div>
          </div>
        </div>
      </div>
    </div>
  );
}
