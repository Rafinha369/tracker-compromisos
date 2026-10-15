const pct = (n) => `${Math.round(n * 100)} %`;

export default function Scoreboard({ summary: s }) {
  const cells = [
    { label: "Precisión", value: pct(s.precision), detail: `${s.found} de ${s.predicted} propuestos eran compromisos reales` },
    { label: "Recall", value: pct(s.recall), detail: `${s.found} de ${s.gold} compromisos esperados fueron encontrados` },
    { label: "Responsable correcto", value: `${s.ownerCorrect}/${s.found}`, detail: "Entre los compromisos encontrados" },
    { label: "Fecha correcta", value: `${s.dateCorrect}/${s.found}`, detail: "Entre los compromisos encontrados" },
    { label: "Compromisos falsos", value: String(s.falseCommitments), detail: "Ideas, decisiones o preguntas tomadas como tarea" },
  ];
  return (
    <dl className="grid grid-cols-2 border-l border-t border-line bg-sheet lg:grid-cols-5">
      {cells.map((c) => (
        <div key={c.label} className="border-b border-r border-line px-4 py-4 last:col-span-2 lg:last:col-span-1">
          <dt className="text-sm font-semibold">{c.label}</dt>
          <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums">{c.value}</dd>
          <dd className="mt-1 text-sm text-ink-muted">{c.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
