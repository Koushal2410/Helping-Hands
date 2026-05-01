import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hh_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('hh_admin') === 'true');

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('hh_user', JSON.stringify(userData));
  };

  const adminLogin = (username, password) => {
    if (username === 'KK' && password === 'Helpinghands2005') {
      setIsAdmin(true);
      localStorage.setItem('hh_admin', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('hh_user');
    localStorage.removeItem('hh_admin');
  };

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('hh_users') || '[]');
    const exists = users.find(u => u.email === userData.email);
    if (exists) return { success: false, message: 'Email already registered' };
    const newUser = { ...userData, id: `user_${Date.now()}`, joinedAt: new Date().toISOString(), donations: [], events: [] };
    users.push(newUser);
    localStorage.setItem('hh_users', JSON.stringify(users));
    login(newUser);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout, signup, adminLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
