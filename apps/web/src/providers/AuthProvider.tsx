import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, authStore } from "../lib/api/client";
import type { User } from "../types";

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(authStore.get()?.user ?? null);
  const [isReady] = useState(true);

  useEffect(() => {
    authStore.onExpired(() => setUser(null));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      login: async (email: string, password: string) => {
        const result = await api.login(email, password);
        authStore.set(result);
        setUser(result.user);
      },
      logout: async () => {
        try {
          await api.logout();
        } finally {
          authStore.set(null);
          setUser(null);
        }
      },
    }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider eksik.");
  return value;
}
