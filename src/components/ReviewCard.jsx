import { Check, LoaderCircle, X } from "lucide-react";

const field = "w-full rounded border border-line bg-sheet px-2 py-1 text-base font-normal hover:border-ink-muted disabled:bg-paper disabled:text-ink-muted";
const missing = "border-warn bg-[#FFF8EC]";

function confidenceStyle(c) {
  if (c >= 0.8) return "bg-[#E2F0E8] text-ok";
  if (c >= 0.6) return "bg-[#FBF0DC] text-warn";
  return "bg-[#F8E1DF] text-bad";
}

export default function ReviewCard({ row, active, onPick, onChange, onApprove, onForce, onDiscard }) {
  const done = row.decision !== "abierto";
  const set = (patch) => onChange(row.tempId, patch);

  return (
    <article onClick={() => onPick(row.tempId)}
      className={`border border-l-4 bg-sheet p-4 ${active ? "border-marker" : "border-line"} ${done ? "opacity-70" : ""}`}>
      <div className="flex items-center gap-2 text-sm">
        <span className={`rounded px-2 font-semibold tabular-nums ${confidenceStyle(row.confidence)}`} title="Confianza de la IA">
          {Math.round(row.confidence * 100)} %
        </span>
        {row.decision === "aprobado" && <span className="font-semibold text-ok">En el tracker</span>}
        {row.decision === "descartado" && <span className="font-semibold text-ink-muted">Descartado</span>}
      </div>

      <label className="mt-2 block text-sm font-semibold">
        <span className="sr-only">Acción</span>
        <textarea value={row.action} disabled={done} placeholder="Qué hay que hacer" rows={2} onChange={(e) => set({ action: e.target.value })}
          className={`${field} resize-none border-transparent px-1 text-lg font-semibold`} />
      </label>

      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm font-semibold">Responsable
          <input value={row.owner ?? ""} disabled={done} placeholder="Sin asignar"
            onChange={(e) => set({ owner: e.target.value || null })} className={`${field} ${!row.owner ? missing : ""}`} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Fecha límite
          <input type="date" value={row.dueDate ?? ""} disabled={done}
            onChange={(e) => set({ dueDate: e.target.value || null })} className={`${field} ${!row.dueDate ? missing : ""}`} />
          {row.dueDateText && <span className="font-normal text-ink-muted">“{row.dueDateText}”</span>}
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold">Prioridad
          <select value={row.priority} disabled={done} onChange={(e) => set({ priority: e.target.value })} className={field}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1 text-sm font-semibold md:col-span-3">Depende de
          <input value={row.dependency ?? ""} disabled={done} placeholder="Nada"
            onChange={(e) => set({ dependency: e.target.value || null })} className={field} />
        </label>
      </div>

      {row.flags.length > 0 && !done && (
        <ul className="mt-4 list-disc bg-[#FFF8EC] py-2 pl-8 pr-4 text-sm text-warn">
          {row.flags.map((f) => <li key={f}>{f}</li>)}
        </ul>
      )}
      {row.sourceSentence && (
        <blockquote className={`mt-4 border-l-4 px-3 text-sm text-ink-muted ${row.checks.sourceFound ? "border-marker" : "border-bad"}`}>
          {row.sourceSentence}
        </blockquote>
      )}
      {row.message && <p className="mt-2 text-sm text-bad" role="alert">{row.message}</p>}

      {!done && (
        <div className="mt-4 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onApprove(row)} disabled={row.saving}
            className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 font-semibold text-sheet hover:bg-accent-hover disabled:opacity-60">
            {row.saving ? <LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden="true" /> : <Check size={16} aria-hidden="true" />}
            {row.saving ? "Guardando…" : "Aprobar"}
          </button>
          {row.canForce && (
            <button onClick={() => onForce(row)} className="rounded border border-line px-4 py-2 font-semibold hover:border-ink">
              Aprobar de todas formas
            </button>
          )}
          <button onClick={() => onDiscard(row.tempId)}
            className="inline-flex items-center gap-2 rounded border border-line px-4 py-2 font-semibold hover:border-ink">
            <X size={16} aria-hidden="true" /> Descartar
          </button>
        </div>
      )}
    </article>
  );
}
