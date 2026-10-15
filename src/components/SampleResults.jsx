import { formatDecimal, formatShortDate } from "../lib/text";

// Detalle por texto: lo encontrado, los errores de responsable o fecha, lo no detectado y los falsos.
export default function SampleResults({ samples }) {
  return (
    <div className="flex flex-col gap-4">
      {samples.map(({ sample, score, ms }) => {
        const wrong = score.matches.filter((m) => !m.ownerOk || !m.dateOk);
        return (
          <section key={sample.id} className="border border-line bg-sheet px-4 py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold">{sample.title}</h3>
              <p className="text-sm text-ink-muted tabular-nums">
                {score.matches.length} de {score.gold} encontrados en {formatDecimal(ms / 1000)} s
              </p>
            </div>
            {!wrong.length && !score.missed.length && !score.falseCommitments.length && (
              <p className="mt-2 text-sm text-ok">Sin errores en este texto.</p>
            )}
            <ul className="mt-2 flex flex-col gap-1 text-sm">
              {wrong.map((m) => (
                <li key={m.gold.anchor}>
                  <span className="font-semibold text-warn">Dato distinto:</span> {m.gold.action}.
                  {!m.ownerOk && ` Responsable esperado ${m.gold.owner ?? "ninguno"}, propuesto ${m.predicted.owner ?? "ninguno"}.`}
                  {!m.dateOk && ` Fecha esperada ${formatShortDate(m.gold.dueDate)}, propuesta ${formatShortDate(m.predicted.dueDate)}.`}
                </li>
              ))}
              {score.missed.map((g) => (
                <li key={g.anchor}><span className="font-semibold text-bad">No detectado:</span> {g.action}.</li>
              ))}
              {score.falseCommitments.map((p, i) => (
                <li key={i}><span className="font-semibold text-bad">Falso compromiso:</span> {p.action}.</li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
