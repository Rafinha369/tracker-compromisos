import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";

const COPY = {
  completado: {
    title: "Marcar como completado",
    label: "Evidencia",
    hint: "Qué se entregó o dónde se puede verificar. Ej.: “Archivo enviado a Carla por correo el 16/10”.",
    confirm: "Marcar como completado",
    required: true,
  },
  bloqueado: {
    title: "Marcar como bloqueado",
    label: "Qué lo bloquea",
    hint: "Opcional, pero ayuda a destrabarlo. Ej.: “Esperando aprobación de Seguridad”.",
    confirm: "Marcar como bloqueado",
    required: false,
  },
  cancelado: {
    title: "Cancelar compromiso",
    label: "Motivo",
    hint: "Cancelar es definitivo: el compromiso no se puede reabrir.",
    confirm: "Cancelar compromiso",
    required: false,
  },
};

export default function StatusDialog({ commitment, to, onConfirm, onClose }) {
  const ref = useRef(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const copy = COPY[to];

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (copy.required && text.trim().length < 5) return setError("Describe la evidencia con al menos 5 caracteres.");
    setBusy(true);
    const message = await onConfirm(to === "completado" ? { evidence: text } : { note: text });
    setBusy(false);
    if (message) setError(message);
  }

  return (
    <dialog ref={ref} onClose={onClose} className="w-[min(32rem,calc(100vw-2rem))] border-l-4 border-accent bg-sheet p-0 text-ink backdrop:bg-ink/40">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <div>
          <h2 className="font-display text-lg font-bold">{copy.title}</h2>
          <p className="mt-1 text-base text-ink-muted">{commitment.action}</p>
        </div>
        <label htmlFor="status-text" className="flex flex-col gap-1 text-sm font-semibold">
          {copy.label}{copy.required ? "" : " (opcional)"}
          <textarea id="status-text" rows={3} value={text} autoFocus disabled={busy} onChange={(e) => setText(e.target.value)}
            className="rounded border border-line px-3 py-2 text-base font-normal hover:border-ink-muted disabled:bg-paper" />
          <span className="font-normal text-ink-muted">{copy.hint}</span>
        </label>
        {error && <p className="text-sm text-bad" role="alert">{error}</p>}
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" onClick={() => ref.current?.close()} disabled={busy}
            className="rounded border border-line px-4 py-2 font-semibold hover:border-ink disabled:opacity-60">
            Volver
          </button>
          <button type="submit" disabled={busy}
            className={`inline-flex items-center gap-2 rounded px-4 py-2 font-semibold text-sheet disabled:opacity-60 ${to === "cancelado" ? "bg-bad hover:bg-[#8A2B25]" : "bg-accent hover:bg-accent-hover"}`}>
            {busy && <LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden="true" />}
            {busy ? "Guardando…" : copy.confirm}
          </button>
        </div>
      </form>
    </dialog>
  );
}
