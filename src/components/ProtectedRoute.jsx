import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FullScreenMessage from "./FullScreenMessage";

export default function ProtectedRoute({ children }) {
  const { session, loading, error } = useAuth();
  const location = useLocation();

  if (loading) return <FullScreenMessage title="Revisando tu sesión…" />;
  if (error)
    return (
      <FullScreenMessage title="No pudimos revisar tu sesión" tone="error">
        {error.message} Recarga la página; si sigue, revisa las variables de Supabase en Vercel.
      </FullScreenMessage>
    );
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
