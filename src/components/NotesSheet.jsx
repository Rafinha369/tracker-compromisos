import { useEffect } from "react";

const KIND_LABEL = { compromiso: "Compromiso", decision: "Decisión", idea: "Idea", pregunta: "Pregunta" };

// Ubica cada frase de origen dentro de las notas, sin superposiciones.
function findRanges(notes, rows) {
  const ranges = [];
  for (const row of rows) {
    let s = row.sourceSentence?.trim();
    if (!s) continue;
    let start = notes.indexOf(s);
    if (start === -1) {
      s = s.replace(/\.$/, "");
      start = notes.indexOf(s);
    }
    if (start === -1) continue;
    const end = start + s.length;
    if (!ranges.some((r) => start < r.end && end > r.start)) ranges.push({ start, end, row });
  }
  return ranges.sort((a, b) => a.start - b.start);
}

export default function NotesSheet({ title, meetingDate, notes, rows, active, onPick }) {
  // Al elegir una tarjeta, lleva la frase resaltada a la vista
  useEffect(() => {
    if (active) document.getElementById(`mark-${active}`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const parts = [];
  let cursor = 0;
  findRanges(notes, rows).forEach(({ start, end, row }) => {
    if (start > cursor) parts.push(notes.slice(cursor, start));
    const isCommit = row.kind === "compromiso";
    const isActive = active === row.tempId;
    const style = row.decision === "descartado"
      ? "text-ink-muted line-through"
      : isActive
        ? "bg-marker ring-2 ring-marker"
        : isCommit ? "bg-marker-soft" : "bg-transparent underline decoration-dotted decoration-ink-muted underline-offset-4";
    parts.push(
      <mark key={row.tempId} id={`mark-${row.tempId}`} title={KIND_LABEL[row.kind]} onClick={() => onPick(row.tempId)}
        className={`cursor-pointer rounded-sm px-0.5 text-ink ${style}`}>
        {notes.slice(start, end)}
      </mark>
    );
    cursor = end;
  });
  parts.push(notes.slice(cursor));

  return (
    <aside className="max-h-[45vh] overflow-auto border border-line bg-sheet px-4 py-4 md:px-6 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)]"
      aria-label="Notas originales">
      <div className="flex justify-between gap-4 border-b border-line pb-2 text-sm text-ink-muted">
        <strong className="text-ink">{title || "Notas sin título"}</strong>
        <span className="tabular-nums">{meetingDate}</span>
      </div>
      <div className="mt-4 whitespace-pre-wrap text-base leading-8">{parts}</div>
    </aside>
  );
}
