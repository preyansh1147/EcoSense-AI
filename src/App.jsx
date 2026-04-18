import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chatbot from './components/Chatbot';
// Energy monitoring pages
import Dashboard from './components/Dashboard';
import CarbonForecast from './components/CarbonForecast';
import SectorDNA from './components/SectorDNA';
import EnergyFlow from './components/EnergyFlow';
import Automation from './components/Automation';
import CoolantIntelligence from './components/CoolantIntelligence';
import PassiveEnergy from './components/PassiveEnergy';
import CarbonCredit from './components/CarbonCredit';
import Alerts from './components/Alerts';
import MultiBuilding from './components/MultiBuilding';
// Marketplace pages
import MarketDashboard from './components/marketplace/MarketDashboard';
import BuyCredits from './components/marketplace/BuyCredits';
import SellCredits from './components/marketplace/SellCredits';
import AIInsights from './components/marketplace/AIInsights';
import Transactions from './components/marketplace/Transactions';
import CreditLogic from './components/marketplace/CreditLogic';
// Data
import { SECTOR_DATA } from './data/sectorData';

/* ─── Guards ────────────────────────────────────────────────────────── */

/** Redirect authenticated users away from public-only pages (login, landing) */
function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
}

/** Redirect unauthenticated users to login */
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}

/* ─── Authenticated shell (sidebar + header + content) ──────────────── */
function AppShell() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const sector = user?.sector || 'hospital';
  const data = SECTOR_DATA[sector] || SECTOR_DATA.hospital;
  const alertCount = data.alerts.filter(a => a.level === 'critical').length;

  // Redirect bare "/" to dashboard when logged in
  useEffect(() => {
    if (location.pathname === '/') navigate('/dashboard', { replace: true });
  }, [location.pathname, navigate]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar alertCount={alertCount} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header alertCount={alertCount} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Routes>
            {/* Energy monitoring */}
            <Route path="/dashboard"  element={<Dashboard data={data} />} />
            <Route path="/forecast"   element={<CarbonForecast data={data} />} />
            <Route path="/sector"     element={<SectorDNA data={data} />} />
            <Route path="/flow"       element={<EnergyFlow data={data} />} />
            <Route path="/automation" element={<Automation data={data} />} />
            <Route path="/coolant"    element={<CoolantIntelligence data={data} />} />
            <Route path="/passive"    element={<PassiveEnergy data={data} />} />
            <Route path="/carbon"     element={<CarbonCredit data={data} />} />
            <Route path="/alerts"     element={<Alerts data={data} />} />
            <Route path="/buildings"  element={<MultiBuilding data={data} />} />
            {/* Marketplace */}
            <Route path="/marketplace"              element={<MarketDashboard />} />
            <Route path="/marketplace/buy"          element={<BuyCredits />} />
            <Route path="/marketplace/sell"         element={<SellCredits />} />
            <Route path="/marketplace/insights"     element={<AIInsights />} />
            <Route path="/marketplace/transactions" element={<Transactions />} />
            <Route path="/marketplace/logic"        element={<CreditLogic />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <Chatbot data={data} />
    </div>
  );
}

/* ─── Root router ────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* All private routes go through AppShell */}
      <Route path="/*" element={<PrivateRoute><AppShell /></PrivateRoute>} />
    </Routes>
  );
}
