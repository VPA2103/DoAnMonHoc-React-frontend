import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getAuthFromStorage,
  saveAuthToStorage,
  clearAuthStorage,
} from "../utils/authStorage";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuth] = useState(() => getAuthFromStorage());

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const syncUser = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!cancelled) {
          saveAuthToStorage(token, res.data.data);
          setAuth({ token, user: res.data.data });
        }
      } catch (err) {
        if (err.response?.status === 401) {
          clearAuthStorage();
          setAuth({ token: null, user: null });
        }
      }
    };

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [token]);


  const login = (token, user) => {
    saveAuthToStorage(token, user);
    setAuth({ token, user });
  };

  const logout = () => {
    clearAuthStorage();
    setAuth({ token: null, user: null });
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      role: user?.vai_tro,
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
