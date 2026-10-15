import { EVALUATION_SAMPLES } from "../data/evaluationSamples";

// Muestra el set de prueba antes de evaluar: qué se mide y qué trampas tiene cada texto.
export default function EvaluationSet() {
  return (
    <ol className="border border-line bg-sheet">
      {EVALUATION_SAMPLES.map((s, i) => (
        <li key={s.id} className="grid gap-1 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[2rem_minmax(0,1fr)_10rem] md:gap-4">
          <span className="font-display text-lg font-bold text-ink-muted">{i + 1}</span>
          <div>
            <p className="text-base font-semibold">{s.title}</p>
            <p className="mt-1 text-sm text-ink-muted">Trampas: {s.traps}</p>
          </div>
          <p className="text-sm md:text-right">
            <span className="font-display text-lg font-bold tabular-nums">{s.gold.length}</span> compromisos esperados
          </p>
        </li>
      ))}
    </ol>
  );
}
