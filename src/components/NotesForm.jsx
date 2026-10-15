import { useState } from "react";
import { LoaderCircle, PencilLine } from "lucide-react";
import { EVALUATION_SAMPLES } from "../data/evaluationSamples";
import { todayISO } from "../lib/text";
import TextField from "./TextField";

export default function NotesForm({ value, onChange, onSubmit, loading, error, onAddManual }) {
  const [touched, setTouched] = useState(false);
  const tooShort = value.notes.trim().length < 20;
  const set = (patch) => onChange({ ...value, ...patch });

  function loadSample(s) {
    onChange({ title: s.title, meetingDate: s.meetingDate, notes: s.notes });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!tooShort) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border border-line bg-sheet p-4 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField id="title" label="Título o fuente" placeholder="Ej.: Reunión cierre de nómina" value={value.title}
          onChange={(e) => set({ title: e.target.value })} disabled={loading} />
        <TextField id="meetingDate" label="Fecha de la reunión" type="date" value={value.meetingDate || todayISO()}
          hint="Se usa para convertir “el viernes” o “mañana” en fechas."
          onChange={(e) => set({ meetingDate: e.target.value })} disabled={loading} />
      </div>

      <label htmlFor="notes" className="flex flex-col gap-1 text-sm font-semibold">
        Notas
        <textarea id="notes" rows={12} value={value.notes} disabled={loading} placeholder="Pega aquí la minuta, el hilo de chat o el correo."
          onChange={(e) => set({ notes: e.target.value })}
          className="rounded border border-line bg-sheet px-3 py-2 text-base font-normal leading-7 hover:border-ink-muted disabled:bg-paper" />
        {touched && tooShort && <span className="font-normal text-bad">Pega notas de al menos 20 caracteres.</span>}
      </label>

      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
        <span>Probar con un ejemplo sintético:</span>
        {EVALUATION_SAMPLES.map((s) => (
          <button key={s.id} type="button" onClick={() => loadSample(s)} disabled={loading}
            className="rounded-full border border-line px-3 py-1 text-ink hover:border-ink disabled:opacity-60">
            {s.title}
          </button>
        ))}
      </div>

      {error && (
        <div className="border-l-4 border-bad bg-paper px-4 py-3 text-sm" role="alert">
          <p className="text-bad">{error.message}</p>
          {error.aiUnavailable && (
            <button type="button" onClick={onAddManual}
              className="mt-2 inline-flex items-center gap-2 rounded border border-line bg-sheet px-3 py-1 font-semibold hover:border-ink">
              <PencilLine size={16} aria-hidden="true" /> Agregar compromiso a mano
            </button>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={loading}
          className="inline-flex items-center gap-2 rounded bg-accent px-6 py-3 text-base font-semibold text-sheet hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
          {loading && <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />}
          {loading ? "Leyendo las notas…" : "Extraer compromisos"}
        </button>
        {loading && <span className="text-sm text-ink-muted" role="status">Suele tardar entre 10 y 30 segundos.</span>}
      </div>
    </form>
  );
}
