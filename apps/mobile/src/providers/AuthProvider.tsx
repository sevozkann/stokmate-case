import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, restoreSession } from "../lib/api/client";
import type { User } from "../types";

const AuthContext = createContext<{
  user: User | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  ready: false,
  login: async () => undefined,
  logout: async () => undefined,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void restoreSession()
      .then((session) => setUser(session?.user ?? null))
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(
    () => ({
      user,
      ready,
      login: async (email: string, password: string) => {
        const result = await api.login(email, password);
        setUser(result.user);
      },
      logout: async () => {
        await api.logout();
        setUser(null);
      },
    }),
    [ready, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
