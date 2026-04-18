import { AlertTriangle, AlertCircle, Info, CheckCircle2, Bell } from 'lucide-react';
import { useState } from 'react';

const ICONS = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
  success: CheckCircle2,
};

const COLORS = {
  critical: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
  warning: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10',
  info: 'border-l-cyan-500 bg-cyan-50 dark:bg-cyan-900/10',
  success: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-900/10',
};

const ICON_COLORS = {
  critical: 'text-red-500',
  warning: 'text-amber-500',
  info: 'text-cyan-500',
  success: 'text-emerald-500',
};

export default function Alerts({ data }) {
  const { alerts } = data;
  const [filter, setFilter] = useState('all');
  const [dismissed, setDismissed] = useState([]);

  const visible = alerts.filter(a => !dismissed.includes(a.id) && (filter === 'all' || a.level === filter));

  const counts = alerts.reduce((acc, a) => { acc[a.level] = (acc[a.level] || 0) + 1; return acc; }, {});

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Alerts & Recommendations Engine</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Real-time AI-powered intelligence</p>
        </div>
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-red-500 animate-bounce-slow" />
          <span className="text-sm font-semibold text-red-500">{counts.critical || 0} Critical</span>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { level: 'critical', label: 'Critical', color: 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30 text-red-500' },
          { level: 'warning', label: 'Warning', color: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30 text-amber-500' },
          { level: 'info', label: 'Info', color: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-800/30 text-cyan-500' },
          { level: 'success', label: 'Success', color: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 text-emerald-500' },
        ].map(t => (
          <button key={t.level} onClick={() => setFilter(filter === t.level ? 'all' : t.level)}
            className={`p-3 rounded-xl border text-center transition-all card-hover ${t.color} ${filter === t.level ? 'ring-2 ring-offset-1 ring-current' : ''}`}>
            <div className="text-2xl font-bold">{counts[t.level] || 0}</div>
            <div className="text-xs font-medium mt-0.5">{t.label}</div>
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {visible.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <CheckCircle2 size={40} className="mx-auto mb-2 text-emerald-500" />
            <div className="text-sm font-medium">All clear! No active {filter !== 'all' ? filter : ''} alerts.</div>
          </div>
        ) : visible.map(a => {
          const Icon = ICONS[a.level];
          return (
            <div key={a.id} className={`border-l-4 rounded-r-xl p-4 transition-all ${COLORS[a.level]} flex items-start gap-3 animate-in`}>
              <Icon size={18} className={`${ICON_COLORS[a.level]} flex-shrink-0 mt-0.5`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{a.msg}</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{a.time}</div>
              </div>
              <button onClick={() => setDismissed(p => [...p, a.id])}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                Dismiss
              </button>
            </div>
          );
        })}
      </div>

      {dismissed.length > 0 && (
        <button onClick={() => setDismissed([])}
          className="w-full py-2 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Restore {dismissed.length} dismissed alert{dismissed.length > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );
}
