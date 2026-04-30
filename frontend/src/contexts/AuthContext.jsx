import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../services/api";
import { AuthContext, getErrorMessage, TOKEN_KEY } from "./auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    setLoading(true);

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      return data.user;
    } catch (error) {
      logout();
      throw new Error(getErrorMessage(error, "Não foi possível carregar o usuário."), {
        cause: error,
      });
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      const message =
        error?.response?.status === 401
          ? "E-mail ou senha inválidos."
          : getErrorMessage(error, "Não foi possível entrar.");

      throw new Error(message, {
        cause: error,
      });
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Não foi possível criar a conta."), {
        cause: error,
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    async function loadInitialUser() {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadInitialUser();
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      loadUser,
    }),
    [user, loading, login, register, logout, loadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
