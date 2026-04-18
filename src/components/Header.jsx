import { Bell, Sun, Moon, LogOut, Building2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PAGE_TITLES = {
  '/dashboard':                  'Command Center',
  '/forecast':                   'Carbon Forecast',
  '/sector':                     'Sector DNA Insights',
  '/flow':                       'Energy Flow Visualizer',
  '/automation':                 'Automation & Control',
  '/coolant':                    'Coolant Intelligence',
  '/passive':                    'Passive Energy Module',
  '/carbon':                     'Carbon Credit & ESG',
  '/alerts':                     'Alerts & Recommendations',
  '/buildings':                  'Multi-Building View',
  '/marketplace':                'Carbon Credit Marketplace',
  '/marketplace/buy':            'Buy Credits',
  '/marketplace/sell':           'Sell Credits',
  '/marketplace/insights':       'AI Insights',
  '/marketplace/transactions':   'Transactions',
  '/marketplace/logic':          'Credit Logic Dashboard',
};

export default function Header({ alertCount }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 glass px-4 md:px-6 py-3 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
          <Building2 size={11} />
          {user?.org}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button onClick={toggle} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <div className="relative">
          <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bell size={17} />
          </button>
          {alertCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
              {alertCount}
            </span>
          )}
        </div>
        <button onClick={handleLogout} className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors" title="Logout">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
