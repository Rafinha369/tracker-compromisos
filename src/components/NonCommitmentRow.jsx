const KIND_LABEL = { decision: "Decisión", idea: "Idea", pregunta: "Pregunta" };

export default function NonCommitmentRow({ row, active, onPick, onConvert }) {
  return (
    <div onClick={() => onPick(row.tempId)}
      className={`flex flex-wrap items-baseline gap-2 border-b border-line px-1 py-2 text-base ${active ? "bg-marker-soft" : ""}`}>
      <span className="rounded bg-paper px-2 text-sm font-semibold text-ink-muted">{KIND_LABEL[row.kind]}</span>
      <span className="flex-1">{row.action}</span>
      <button onClick={(e) => { e.stopPropagation(); onConvert(row.tempId); }}
        className="text-sm font-semibold text-accent underline-offset-4 hover:underline">
        Convertir en compromiso
      </button>
    </div>
  );
}
