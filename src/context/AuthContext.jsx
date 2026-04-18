import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const USERS = {
  'admin@ecosense.ai': {
    password: 'ecosense123',
    name: 'Admin',
    role: 'Platform Admin',
    org: 'EcoSense HQ',
    sector: 'enterprise',
    avatar: 'AS',
    sectorLabel: 'Enterprise',
  },
  'datacenter@ecosense.ai': {
    password: 'dc123',
    name: 'Priya Singh',
    role: 'Ops Lead',
    org: 'NexaCloud Data Centers',
    sector: 'datacenter',
    avatar: 'PS',
    sectorLabel: 'Data Center',
  },
  'school@ecosense.ai': {
    password: 'school123',
    name: 'Rajan Verma',
    role: 'Facilities Head',
    org: 'Delhi Public School, Noida',
    sector: 'school',
    avatar: 'RV',
    sectorLabel: 'School',
  },
  'college@ecosense.ai': {
    password: 'college123',
    name: 'Prof. Anita Roy',
    role: 'Campus Sustainability Lead',
    org: 'IIT Bombay Campus',
    sector: 'college',
    avatar: 'AR',
    sectorLabel: 'College',
  },
  'factory@ecosense.ai': {
    password: 'factory123',
    name: 'Suresh Patil',
    role: 'Plant Energy Manager',
    org: 'Patil Industries Pvt. Ltd.',
    sector: 'factory',
    avatar: 'SP',
    sectorLabel: 'Factory',
  },
  'corporate@ecosense.ai': {
    password: 'corp123',
    name: 'Neha Sharma',
    role: 'Sustainability Director',
    org: 'TechCorp India HQ, Gurugram',
    sector: 'corporate',
    avatar: 'NS',
    sectorLabel: 'Corporate',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eco-user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = USERS[email];
    if (found && found.password === password) {
      const userData = { email, ...found };
      setUser(userData);
      localStorage.setItem('eco-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eco-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
