import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ArrowDownCircle, ArrowUpCircle, Lock, Search, Filter, ChevronDown } from 'lucide-react';

const TYPE_CONFIG = {
  buy: { label: 'Buy', icon: ArrowDownCircle, bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  sell: { label: 'Sell', icon: ArrowUpCircle, bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  retire: { label: 'Retire', icon: Lock, bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
};
const STATUS_CONFIG = {
  completed: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
  pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
  retired: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
};

export default function Transactions() {
  const { transactions, wallet } = useMarketplace();
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => {
    const matchType = typeFilter === 'All' || t.type === typeFilter.toLowerCase();
    const matchStatus = statusFilter === 'All' || t.status === statusFilter.toLowerCase();
    const matchSearch = t.project.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  const totalBought = transactions.filter(t => t.type === 'buy').reduce((s, t) => s + t.credits, 0);
  const totalSold = transactions.filter(t => t.type === 'sell').reduce((s, t) => s + t.credits, 0);
  const totalRetired = transactions.filter(t => t.type === 'retire').reduce((s, t) => s + t.credits, 0);
  const totalRevenue = transactions.filter(t => t.type === 'sell' && t.net).reduce((s, t) => s + (t.net || 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white">Transaction History</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete audit trail of all your carbon credit activity</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bought', value: `${totalBought} tCO₂e`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30' },
          { label: 'Total Sold', value: `${totalSold} tCO₂e`, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800/30' },
          { label: 'Total Retired', value: `${totalRetired} tCO₂e`, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30' },
          { label: 'Net Revenue', value: `₹${(totalRevenue || wallet.revenueEarned).toLocaleString()}`, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 border ${s.bg}`}>
            <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by project or ID…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-green-500 text-gray-900 dark:text-white" />
        </div>
        {[
          { label: typeFilter, options: ['All', 'Buy', 'Sell', 'Retire'], set: setTypeFilter },
          { label: statusFilter, options: ['All', 'Completed', 'Pending', 'Retired'], set: setStatusFilter },
        ].map((f, i) => (
          <div key={i} className="relative group">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 hover:border-green-500 transition-colors">
              <Filter size={13} /> {f.label} <ChevronDown size={13} />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-10 w-36 hidden group-hover:block">
              {f.options.map(o => (
                <button key={o} onClick={() => f.set(o)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 first:rounded-t-xl last:rounded-b-xl">{o}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Txn ID', 'Type', 'Project', 'Credits', 'Price/cr', 'Gross', 'Commission', 'Net', 'Cert', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map(tx => {
                const T = TYPE_CONFIG[tx.type] || TYPE_CONFIG.buy;
                return (
                  <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{tx.id}</td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${T.bg} ${T.text}`}>
                        <T.icon size={11} /> {T.label}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[150px] truncate">{tx.project}</td>
                    <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">{tx.credits}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{tx.price ? `₹${tx.price.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{tx.total ? `₹${tx.total.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-red-500">{tx.commission ? `-₹${tx.commission.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 font-bold text-green-600 dark:text-green-400">{tx.net ? `₹${tx.net.toLocaleString()}` : tx.type === 'buy' ? `₹${tx.total?.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{tx.cert || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_CONFIG[tx.status]}`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400 dark:text-gray-600 text-sm">No transactions match your filters.</div>
        )}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400">
          {filtered.length} of {transactions.length} transactions
        </div>
      </div>
    </div>
  );
}
