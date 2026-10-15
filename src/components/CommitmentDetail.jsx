import { STATUS_LABEL } from "../lib/rules";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function CommitmentDetail({ commitment }) {
  const { source_sentence, source_title, dependency, evidence, history } = commitment;
  return (
    <div className="mt-4 grid gap-4 border-t border-line pt-4 text-sm md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <p className="text-ink-muted">Fuente: {source_title}</p>
        {source_sentence ? (
          <blockquote className="border-l-4 border-marker px-3 text-base">{source_sentence}</blockquote>
        ) : (
          <p className="text-ink-muted">Creado a mano, sin frase de origen.</p>
        )}
        {dependency && <p><span className="font-semibold">Depende de:</span> {dependency}</p>}
        {evidence && <p><span className="font-semibold">Evidencia:</span> {evidence}</p>}
      </div>
      <div>
        <p className="font-semibold">Historial</p>
        <ol className="mt-2 flex flex-col gap-1 border-l border-line pl-4">
          {(history ?? []).map((h, i) => (
            <li key={i}>
              <span className="tabular-nums text-ink-muted">{formatDateTime(h.at)}</span>{" "}
              {h.from ? `${STATUS_LABEL[h.from]} → ` : ""}{STATUS_LABEL[h.to]}
              {h.note && <span className="text-ink-muted"> ({h.note})</span>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
