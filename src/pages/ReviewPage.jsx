import { useState } from "react";
import { CheckCheck, FilePlus2, PencilLine } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReview } from "../hooks/useReview";
import { formatDecimal, todayISO } from "../lib/text";
import NotesForm from "../components/NotesForm";
import NotesSheet from "../components/NotesSheet";
import ReviewQueue from "../components/ReviewQueue";

const secondary = "inline-flex items-center gap-2 rounded border border-line bg-sheet px-4 py-2 font-semibold hover:border-ink";

export default function ReviewPage() {
  usePageTitle("Extraer y revisar");
  const [input, setInput] = useState({ title: "", meetingDate: todayISO(), notes: "" });
  const [active, setActive] = useState(null);
  const review = useReview();
  const { rows, status, meta } = review;

  const handlers = {
    pick: setActive,
    update: review.update,
    approve: (row) => review.approve(row, input.title),
    force: (row) => review.approve(row, input.title, true),
    discard: (id) => review.update(id, { decision: "descartado" }),
    convert: (id) => review.update(id, { kind: "compromiso", route: "revision", flags: ["Convertido a compromiso por quien revisa"] }),
  };
  const readyCount = rows?.filter((r) => r.route === "listo" && r.decision === "abierto").length ?? 0;

  function startOver() {
    review.reset();
    setActive(null);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-xl font-extrabold md:text-2xl">Extraer y revisar</h1>
      <p className="mt-2 max-w-2xl text-base text-ink-muted">
        Pega una minuta, un hilo de chat o un correo. La IA propone los compromisos; tú decides cuáles se guardan.
      </p>

      {review.warning && <p className="mt-4 border-l-4 border-warn bg-sheet px-4 py-2 text-sm text-warn" role="alert">{review.warning}</p>}

      {!rows ? (
        <div className="mt-8">
          <NotesForm value={input} onChange={setInput} loading={status === "loading"} error={review.error}
            onSubmit={() => review.extract(input)} onAddManual={review.addManual} />
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[5fr_6fr] lg:items-start">
          {input.notes.trim() ? (
            <NotesSheet title={input.title} meetingDate={input.meetingDate} notes={input.notes} rows={rows} active={active} onPick={setActive} />
          ) : (
            <p className="border border-dashed border-line bg-sheet p-4 text-sm text-ink-muted">Sin notas: estás agregando compromisos a mano.</p>
          )}
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <p className="mr-auto text-base">
                <strong>{rows.length} {rows.length === 1 ? "ítem" : "ítems"}</strong>
                {meta && <span className="text-ink-muted"> detectados en {formatDecimal(meta.ms / 1000)} s</span>}
              </p>
              {readyCount > 0 && (
                <button onClick={() => review.approveReady(input.title)}
                  className="inline-flex items-center gap-2 rounded bg-accent px-4 py-2 font-semibold text-sheet hover:bg-accent-hover">
                  <CheckCheck size={16} aria-hidden="true" />
                  {readyCount === 1 ? "Aprobar el listo" : `Aprobar los ${readyCount} listos`}
                </button>
              )}
              <button onClick={review.addManual} className={secondary}><PencilLine size={16} aria-hidden="true" /> Agregar a mano</button>
              <button onClick={startOver} className={secondary}><FilePlus2 size={16} aria-hidden="true" /> Procesar otras notas</button>
            </div>
            <ReviewQueue rows={rows} active={active} handlers={handlers} />
          </div>
        </div>
      )}
    </main>
  );
}
