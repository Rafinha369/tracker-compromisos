import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { signIn, signUp } from "../services/auth";
import TextField from "./TextField";

const MODES = {
  signin: { tab: "Iniciar sesión", submit: "Iniciar sesión", busy: "Entrando…" },
  signup: { tab: "Crear cuenta", submit: "Crear cuenta", busy: "Creando la cuenta…" },
};

export default function LoginForm({ onSignedIn }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const action = mode === "signin" ? signIn : signUp;
    const { data, error } = await action(email.trim(), password);
    setBusy(false);
    if (error) return setError(error.message);
    if (data?.session) return onSignedIn();
    // Supabase pide confirmar el email antes de crear la sesión
    setNotice(`Te enviamos un enlace a ${email.trim()}. Ábrelo para activar la cuenta y luego inicia sesión.`);
    setMode("signin");
  }

  function switchMode(next) {
    setMode(next);
    setError(null);
    setNotice(null);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate={false}>
      <div className="flex border-b border-line" role="tablist">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={mode === key}
            onClick={() => switchMode(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-base font-semibold ${
              mode === key ? "border-accent text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {m.tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <TextField id="email" label="Email" type="email" required autoComplete="email" value={email}
          onChange={(e) => setEmail(e.target.value)} disabled={busy} />
        <TextField id="password" label="Contraseña" type="password" required minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          hint={mode === "signup" ? "Mínimo 6 caracteres." : undefined}
          value={password} onChange={(e) => setPassword(e.target.value)} disabled={busy} />
      </div>

      {error && <p className="mt-4 border-l-4 border-bad bg-sheet px-3 py-2 text-sm text-bad" role="alert">{error}</p>}
      {notice && <p className="mt-4 border-l-4 border-ok bg-sheet px-3 py-2 text-sm text-ink" role="status">{notice}</p>}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-3 text-base font-semibold text-sheet hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy && <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />}
        {busy ? MODES[mode].busy : MODES[mode].submit}
      </button>
    </form>
  );
}
