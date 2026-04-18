import { createContext, useContext, useState } from 'react';
import { COMMISSION_RATES } from '../data/marketplaceData';

const MarketplaceContext = createContext();

const gid = () => Math.random().toString(36).substr(2, 8).toUpperCase();
const TODAY = 'Apr 18, 2026';

const INITIAL = {
  wallet: {
    creditsOwned: 245,
    creditsSold: 180,
    revenueEarned: 270000,
    fundsBalance: 125000,
    marketPrice: 1580,
    priceChange: 2.4,
  },
  listings: [
    { id: 'L001', credits: 50, price: 1580, cert: 'Gold Standard', status: 'active', date: 'Apr 16, 2026', commissionPct: 12 },
    { id: 'L002', credits: 30, price: 1550, cert: 'Verra VCS', status: 'sold', date: 'Apr 10, 2026', commissionPct: 10 },
    { id: 'L003', credits: 20, price: 1600, cert: 'Gold Standard', status: 'active', date: 'Apr 14, 2026', commissionPct: 12 },
    { id: 'L004', credits: 15, price: 1390, cert: 'Verra VCS', status: 'sold', date: 'Mar 29, 2026', commissionPct: 10 },
  ],
  transactions: [
    { id: 'TXN001', type: 'buy', project: 'Rajasthan Wind Power', credits: 100, price: 1380, total: 138000, status: 'completed', date: 'Apr 5, 2026', cert: 'Verra VCS' },
    { id: 'TXN002', type: 'sell', project: 'My Portfolio', credits: 30, price: 1550, total: 46500, status: 'completed', date: 'Apr 10, 2026', cert: 'Verra VCS', commission: 4650, net: 41850 },
    { id: 'TXN003', type: 'buy', project: 'Maharashtra Solar Farm', credits: 80, price: 1450, total: 116000, status: 'completed', date: 'Mar 28, 2026', cert: 'Verra VCS' },
    { id: 'TXN004', type: 'buy', project: 'Gujarat Biogas Initiative', credits: 65, price: 1520, total: 98800, status: 'pending', date: 'Apr 17, 2026', cert: 'Gold Standard' },
    { id: 'TXN005', type: 'sell', project: 'My Portfolio', credits: 50, price: 1580, total: 79000, status: 'pending', date: 'Apr 16, 2026', cert: 'Gold Standard', commission: 9480, net: 69520 },
    { id: 'TXN006', type: 'retire', project: 'My Portfolio', credits: 25, price: 0, total: 0, status: 'retired', date: 'Mar 15, 2026', cert: 'Gold Standard' },
    { id: 'TXN007', type: 'buy', project: 'Tamil Nadu EV Fleet', credits: 40, price: 1580, total: 63200, status: 'completed', date: 'Mar 5, 2026', cert: 'Gold Standard' },
  ],
};

export function MarketplaceProvider({ children }) {
  const [state, setState] = useState(INITIAL);

  const buyCredits = (project, quantity) => {
    const total = project.pricePerCredit * quantity;
    if (state.wallet.fundsBalance < total) return { ok: false, msg: 'Insufficient funds in wallet.' };

    setState(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        creditsOwned: prev.wallet.creditsOwned + quantity,
        fundsBalance: prev.wallet.fundsBalance - total,
      },
      transactions: [
        {
          id: 'TXN' + gid(),
          type: 'buy',
          project: project.name,
          credits: quantity,
          price: project.pricePerCredit,
          total,
          status: 'completed',
          date: TODAY,
          cert: project.certification,
        },
        ...prev.transactions,
      ],
    }));
    return { ok: true };
  };

  const sellCredits = ({ credits, price, cert, sectorKey }) => {
    if (state.wallet.creditsOwned < credits) return { ok: false, msg: 'Not enough credits in wallet.' };
    const rate = COMMISSION_RATES[cert] ?? 0.15;
    const commission = Math.round(price * credits * rate);
    const net = price * credits - commission;

    setState(prev => ({
      ...prev,
      wallet: {
        ...prev.wallet,
        creditsOwned: prev.wallet.creditsOwned - credits,
        creditsSold: prev.wallet.creditsSold + credits,
        revenueEarned: prev.wallet.revenueEarned + net,
        fundsBalance: prev.wallet.fundsBalance + net,
      },
      listings: [
        { id: 'L' + gid(), credits, price, cert, status: 'active', date: TODAY, commissionPct: Math.round(rate * 100) },
        ...prev.listings,
      ],
      transactions: [
        { id: 'TXN' + gid(), type: 'sell', project: 'My Portfolio', credits, price, total: price * credits, status: 'pending', date: TODAY, cert, commission, net },
        ...prev.transactions,
      ],
    }));
    return { ok: true, commission, net };
  };

  const retireCredits = (credits) => {
    if (state.wallet.creditsOwned < credits) return { ok: false, msg: 'Not enough credits.' };
    setState(prev => ({
      ...prev,
      wallet: { ...prev.wallet, creditsOwned: prev.wallet.creditsOwned - credits },
      transactions: [
        { id: 'TXN' + gid(), type: 'retire', project: 'My Portfolio', credits, price: 0, total: 0, status: 'retired', date: TODAY, cert: 'Gold Standard' },
        ...prev.transactions,
      ],
    }));
    return { ok: true };
  };

  return (
    <MarketplaceContext.Provider value={{ ...state, buyCredits, sellCredits, retireCredits }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export const useMarketplace = () => useContext(MarketplaceContext);
