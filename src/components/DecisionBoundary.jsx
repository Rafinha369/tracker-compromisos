const ROWS = [
  {
    who: "IA (Claude vía OpenRouter)",
    does: "Distingue compromiso, decisión, idea y pregunta. Extrae acción, responsable, fecha, dependencia, prioridad y frase de origen. Estima su confianza y pide aclaración.",
  },
  {
    who: "Código determinista",
    does: "Verifica que la frase exista en las notas, valida fechas, detecta duplicados, envía a revisión todo lo que tenga confianza menor a 80 %, y en la base hace cumplir el flujo de estados y la evidencia.",
  },
  {
    who: "Persona",
    does: "Aprueba, corrige o descarta cada ítem antes de que entre al tracker, y cierra cada compromiso con evidencia.",
  },
];

export default function DecisionBoundary() {
  return (
    <section>
      <h2 className="font-display text-lg font-bold">Quién decide qué</h2>
      <dl className="mt-4 border border-line bg-sheet">
        {ROWS.map((r) => (
          <div key={r.who} className="grid gap-1 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-4">
            <dt className="text-base font-semibold">{r.who}</dt>
            <dd className="text-base text-ink-muted">{r.does}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
