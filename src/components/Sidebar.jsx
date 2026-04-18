import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, TrendingUp, Cpu, Zap, Settings2, Thermometer,
  Sun, Award, Bell, Building2, LogOut, Sun as SunIcon, Moon, Pin, PinOff,
  ShoppingCart, Tag, Activity, ReceiptText, Leaf, BookOpen, Store
} from 'lucide-react';

const ENERGY_NAV = [
  { path: '/dashboard',  icon: LayoutDashboard, label: 'Command Center' },
  { path: '/forecast',   icon: TrendingUp,      label: 'Carbon Forecast' },
  { path: '/sector',     icon: Cpu,             label: 'Sector DNA' },
  { path: '/flow',       icon: Zap,             label: 'Energy Flow' },
  { path: '/automation', icon: Settings2,        label: 'Automation' },
  { path: '/coolant',    icon: Thermometer,      label: 'Coolant Intel' },
  { path: '/passive',    icon: Sun,             label: 'Passive Energy' },
  { path: '/carbon',     icon: Award,           label: 'Carbon & ESG' },
  { path: '/alerts',     icon: Bell,            label: 'Alerts', badge: true },
  { path: '/buildings',  icon: Building2,       label: 'Multi-Building' },
];

const MARKET_NAV = [
  { path: '/marketplace',              icon: Store,       label: 'Market Dashboard' },
  { path: '/marketplace/buy',          icon: ShoppingCart, label: 'Buy Credits' },
  { path: '/marketplace/sell',         icon: Tag,         label: 'Sell Credits' },
  { path: '/marketplace/insights',     icon: Activity,    label: 'AI Insights' },
  { path: '/marketplace/transactions', icon: ReceiptText, label: 'Transactions' },
  { path: '/marketplace/logic',        icon: BookOpen,    label: 'Credit Logic' },
];

export default function Sidebar({ alertCount }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavSection = ({ title, items, color }) => (
    <div className="mb-1">
      {expanded && (
        <div className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${color}`}>{title}</div>
      )}
      {items.map(({ path, icon: Icon, label, badge }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/marketplace'}
          title={!expanded ? label : undefined}
          className={({ isActive }) =>
            `w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 relative mx-1 mb-0.5 ${
              isActive
                ? path.startsWith('/marketplace')
                  ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                  : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
            }`
          }
          style={{ maxWidth: expanded ? 'calc(100% - 8px)' : '100%' }}
        >
          <Icon size={16} className="flex-shrink-0" />
          {expanded && <span className="truncate">{label}</span>}
          {badge && alertCount > 0 && (
            <span className={`${expanded ? 'ml-auto' : 'absolute -top-1 -right-1'} flex-shrink-0 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold`}>
              {alertCount > 9 ? '9+' : alertCount}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`hidden md:flex flex-col h-screen sticky top-0 bg-gray-900 dark:bg-gray-950 border-r border-gray-800 transition-all duration-300 ease-in-out flex-shrink-0 z-40 ${expanded ? 'w-60' : 'w-14'} ${hovered && !pinned ? 'shadow-2xl shadow-black/50' : ''}`}>

      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-800 flex-shrink-0 overflow-hidden">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0">
          <Leaf size={17} className="text-white" />
        </div>
        {expanded && (
          <div className="min-w-0 flex-1">
            <div className="text-sm font-black text-white truncate">EcoSense AI</div>
            <div className="text-[10px] text-green-400 truncate">Carbon Intelligence</div>
          </div>
        )}
        <button
          onClick={() => setPinned(p => !p)}
          title={pinned ? 'Unpin sidebar' : 'Pin sidebar open'}
          className={`ml-auto flex-shrink-0 p-1 rounded-md transition-all duration-200 ${
            pinned
              ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
              : 'text-gray-600 hover:text-gray-300 hover:bg-gray-800'
          } ${!expanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {pinned ? <PinOff size={13} /> : <Pin size={13} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-1 space-y-0.5">
        <NavSection title="⚡ Energy Monitor" items={ENERGY_NAV} color="text-emerald-500/60" />
        <div className="my-2 border-t border-gray-800/60" />
        <NavSection title="💹 Marketplace" items={MARKET_NAV} color="text-green-500/60" />
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-800 space-y-2 flex-shrink-0">
        <button onClick={toggle}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-all"
          title={!expanded ? (isDark ? 'Light Mode' : 'Dark Mode') : undefined}>
          {isDark ? <SunIcon size={17} /> : <Moon size={17} />}
          {expanded && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <div className={`flex items-center gap-2.5 px-2 py-2 rounded-lg bg-gray-800/60 ${!expanded ? 'justify-center' : ''}`}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.avatar}
          </div>
          {expanded && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-gray-500 truncate">{user?.role}</div>
            </div>
          )}
          {expanded && (
            <button onClick={handleLogout} className="text-gray-600 hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

