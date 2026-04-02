import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, verifyToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setLoading(false); return; }
    verifyToken()
      .then(({ data }) => setAdmin(data.admin))
      .catch(() => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const { data } = await loginAPI({ username, password });
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_user', JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
