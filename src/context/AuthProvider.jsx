import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  getAuthFromStorage,
  saveAuthToStorage,
  clearAuthStorage,
} from "../utils/authStorage";

export const AuthProvider = ({ children }) => {
  const [{ token, user }, setAuth] = useState(() => getAuthFromStorage());

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
