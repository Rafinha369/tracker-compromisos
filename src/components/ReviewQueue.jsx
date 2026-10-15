import { Link } from "react-router-dom";
import NonCommitmentRow from "./NonCommitmentRow";
import ReviewCard from "./ReviewCard";

const GROUPS = [
  { route: "listo", title: "Listos para aprobar", note: "Tienen responsable, fecha válida, evidencia en el texto y confianza alta." },
  { route: "revision", title: "Requieren revisión", note: "Falta un dato, la confianza es baja o podría estar repetido. Corrige y aprueba, o descarta." },
  { route: "no_accionable", title: "No son compromisos", note: "Decisiones, ideas y preguntas. No entran al tracker salvo que las conviertas." },
];

export default function ReviewQueue({ rows, active, handlers }) {
  const approved = rows.filter((r) => r.decision === "aprobado").length;

  if (rows.length === 0)
    return (
      <div className="border border-dashed border-line bg-sheet p-8">
        <p className="text-base font-semibold">No encontramos compromisos, decisiones ni preguntas en estas notas.</p>
        <p className="mt-1 text-base text-ink-muted">Prueba con otro texto o agrega un compromiso a mano.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-8">
      {approved > 0 && (
        <p className="border-l-4 border-ok bg-sheet px-4 py-2 text-base" role="status">
          {approved === 1 ? "1 compromiso quedó guardado." : `${approved} compromisos quedaron guardados.`}{" "}
          <Link to="/tracker" className="font-semibold text-accent underline-offset-4 hover:underline">Ver en el tracker</Link>
        </p>
      )}
      {GROUPS.map((g) => {
        const list = rows.filter((r) => r.route === g.route);
        if (!list.length) return null;
        return (
          <section key={g.route}>
            <h2 className="font-display text-lg font-bold">
              {g.title} <span className="font-body font-normal text-ink-muted">{list.length}</span>
            </h2>
            <p className="mb-4 text-sm text-ink-muted">{g.note}</p>
            <div className="flex flex-col gap-4">
              {list.map((row) =>
                g.route === "no_accionable" ? (
                  <NonCommitmentRow key={row.tempId} row={row} active={active === row.tempId} onPick={handlers.pick} onConvert={handlers.convert} />
                ) : (
                  <ReviewCard key={row.tempId} row={row} active={active === row.tempId} onPick={handlers.pick} onChange={handlers.update}
                    onApprove={handlers.approve} onForce={handlers.force} onDiscard={handlers.discard} />
                )
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
