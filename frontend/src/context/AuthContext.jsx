import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { getMeApi } from '../api/user.js';
import { getToken, removeToken, setTokens } from '../api/token.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (access, refresh) => {
    setTokens(access, refresh);
    try {
      const me = await getMeApi(access);
      setAuth({ token: getToken(), me });
      return me;
    } catch (error) {
      removeToken();
      setAuth(null);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setAuth(null);
  }, []);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      const token = getToken();
      if (!token) {
        if (active) setLoading(false);
        return;
      }
      try {
        const me = await getMeApi(token);
        if (active) setAuth({ token: getToken(), me });
      } catch {
        removeToken();
        if (active) setAuth(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    restore();
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ auth, loading, login, logout }), [auth, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
