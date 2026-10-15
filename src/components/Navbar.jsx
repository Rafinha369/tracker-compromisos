import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "../services/auth";
import BrandMark from "./BrandMark";

const LINKS = [
  { to: "/", label: "Extraer y revisar" },
  { to: "/tracker", label: "Tracker" },
  { to: "/metricas", label: "Métricas" },
];

export default function Navbar() {
  const { session } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function handleSignOut() {
    setBusy(true);
    const { error } = await signOut();
    setError(error?.message ?? null);
    setBusy(false);
  }

  return (
    <header className="bg-ink text-sheet">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center gap-4 px-4 py-3 md:px-8">
        <BrandMark />
        <nav className="flex gap-1" aria-label="Principal">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              className={({ isActive }) =>
                `rounded px-3 py-1 text-sm font-medium transition-colors ${
                  isActive ? "bg-marker text-ink" : "text-line hover:text-sheet"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <span className="hidden text-line sm:inline">{session?.user?.email}</span>
          <button
            onClick={handleSignOut}
            disabled={busy}
            className="flex items-center gap-2 rounded border border-ink-muted px-3 py-1 font-medium hover:border-sheet disabled:opacity-60"
          >
            <LogOut size={16} aria-hidden="true" />
            {busy ? "Cerrando…" : "Cerrar sesión"}
          </button>
        </div>
      </div>
      {error && <p className="bg-bad px-4 py-2 text-sm text-sheet md:px-8" role="alert">{error}</p>}
    </header>
  );
}
