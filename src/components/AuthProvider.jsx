import { useEffect, useState } from "react";
import { AuthContext } from "../hooks/useAuth";
import { getSession, onSessionChange } from "../services/auth";

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSession().then(({ data, error }) => {
      setSession(data);
      setError(error);
      setLoading(false);
    });
    return onSessionChange((next) => setSession(next));
  }, []);

  return <AuthContext.Provider value={{ session, loading, error }}>{children}</AuthContext.Provider>;
}
