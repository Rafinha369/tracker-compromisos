const FILTERS = [
  { key: "abiertos", label: "Abiertos" },
  { key: "vencidos", label: "Vencidos" },
  { key: "bloqueado", label: "Bloqueados" },
  { key: "completado", label: "Completados" },
  { key: "todos", label: "Todos" },
];

export default function TrackerFilters({ filter, onFilter, counts, owners, owner, onOwner }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
        {FILTERS.map((f) => {
          const on = filter === f.key;
          const alert = f.key === "vencidos" && counts.vencidos > 0 && !on;
          return (
            <button key={f.key} onClick={() => onFilter(f.key)} aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${
                on ? "border-ink bg-ink text-sheet" : alert ? "border-bad bg-sheet text-bad hover:bg-paper" : "border-line bg-sheet hover:border-ink"
              }`}>
              {f.label} <span className="tabular-nums">({counts[f.key]})</span>
            </button>
          );
        })}
      </div>
      <label className="ml-auto flex items-center gap-2 text-sm font-semibold">
        <span className="sr-only md:not-sr-only">Responsable</span>
        <select value={owner} onChange={(e) => onOwner(e.target.value)}
          className="rounded border border-line bg-sheet px-2 py-1 text-base font-normal hover:border-ink-muted">
          <option value="">Todos</option>
          {owners.map((o) => <option key={o}>{o}</option>)}
        </select>
      </label>
    </div>
  );
}
