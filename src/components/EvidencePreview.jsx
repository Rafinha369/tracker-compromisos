import { EVALUATION_SAMPLES } from "../data/evaluationSamples";
import { formatShortDate, normalize } from "../lib/text";

const sample = EVALUATION_SAMPLES[0];
// Muestra las líneas de la minuta desde "Revisamos…" en adelante.
const lines = sample.notes.split("\n").slice(3);

function anchorFor(line) {
  const n = normalize(line);
  return sample.gold.find((g) => n.includes(normalize(g.anchor)));
}

export default function EvidencePreview() {
  let order = 0;
  return (
    <figure className="w-full max-w-xl">
      <div className="border border-line bg-sheet px-6 py-6 shadow-[0_1px_0_#C7CFD6,0_6px_0_-3px_#FFFFFF,0_7px_0_-3px_#C7CFD6]">
        <p className="border-b border-line pb-2 text-sm text-ink-muted">{sample.title}</p>
        <div className="mt-4 space-y-2 text-base leading-7">
          {lines.map((line) => {
            const hit = anchorFor(line);
            if (!hit) return <p key={line} className="text-ink-muted">{line}</p>;
            const delay = 300 + order++ * 450;
            return (
              <p key={line}>
                <mark
                  className="bg-gradient-to-r from-marker to-marker bg-no-repeat bg-[length:100%_70%] bg-[position:0_70%] text-ink motion-safe:animate-sweep"
                  style={{ animationDelay: `${delay}ms` }}
                >
                  {line}
                </mark>
              </p>
            );
          })}
        </div>
      </div>
      <figcaption className="mt-6">
        <table className="w-full text-left text-sm">
          <thead className="text-ink-muted">
            <tr>
              <th className="pb-2 font-medium">Queda en el tracker</th>
              <th className="pb-2 font-medium">Responsable</th>
              <th className="pb-2 text-right font-medium">Vence</th>
            </tr>
          </thead>
          <tbody>
            {sample.gold.map((g) => (
              <tr key={g.anchor} className="border-t border-line">
                <td className="py-2 pr-2">{g.action}</td>
                <td className="py-2 pr-2">{g.owner}</td>
                <td className="py-2 text-right tabular-nums">{formatShortDate(g.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-sm text-ink-muted">La decisión, la idea y la pregunta de la minuta no se convierten en tareas.</p>
      </figcaption>
    </figure>
  );
}
