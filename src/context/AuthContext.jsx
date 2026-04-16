import { createContext, useContext, useState, useEffect } from 'react';
import { setAxiosToken } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) setAxiosToken(storedToken);
    return storedToken;
  });

  const login = (data) => {
    const newToken = data?.token;
    const userData = data?.user || data?.currentUser || data;

    if (newToken) {
      localStorage.setItem('token', newToken);
      setAxiosToken(newToken);
      setToken(newToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  useEffect(() => {
    const handleAuthError = () => logout();
    window.addEventListener('auth-error', handleAuthError);
    return () => window.removeEventListener('auth-error', handleAuthError);
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    setAxiosToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // isAuth is now derived from React state, so it's fully reactive
  const isAuth = !!token;

  return (
    <AuthContext.Provider value={{ user, isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);