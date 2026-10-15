import { useState } from "react";
import { formatDecimal } from "../lib/text";
import TextField from "./TextField";

// Compara el tiempo a mano (cronometrado por la persona) con el tiempo asistido: IA + revisión.
export default function TimeComparison({ aiMs }) {
  const [manual, setManual] = useState("");
  const [review, setReview] = useState("");
  const manualMin = Number(manual);
  const assistedMin = aiMs / 60000 + (Number(review) || 0);
  const ready = manualMin > 0 && review !== "";
  const saved = ready ? 1 - assistedMin / manualMin : 0;

  return (
    <section className="border border-line bg-sheet px-4 py-6 md:px-8">
      <h2 className="font-display text-lg font-bold">Antes y después</h2>
      <p className="mt-1 max-w-2xl text-base text-ink-muted">
        Cronométrate procesando los 3 textos a mano: leer, anotar responsable y fecha, y pasarlo a una planilla.
        Luego mide cuánto tardas revisando la cola en “Extraer y revisar”.
      </p>
      <div className="mt-4 grid max-w-xl gap-4 sm:grid-cols-2">
        <TextField id="manual-min" label="Minutos a mano" type="number" min="1" step="0.5" inputMode="decimal"
          value={manual} onChange={(e) => setManual(e.target.value)} />
        <TextField id="review-min" label="Minutos revisando la cola" type="number" min="0" step="0.5" inputMode="decimal"
          value={review} onChange={(e) => setReview(e.target.value)} />
      </div>
      <p className="mt-4 text-sm text-ink-muted">
        La IA tardó {formatDecimal(aiMs / 1000)} s en procesar los 3 textos ({formatDecimal(aiMs / 60000)} min).
      </p>
      {ready ? (
        <p className="mt-2 text-lg font-semibold" role="status">
          {manualMin} min a mano frente a {formatDecimal(assistedMin)} min asistido:{" "}
          {saved > 0 ? `${Math.round(saved * 100)} % menos tiempo.` : "el proceso asistido no ahorró tiempo en esta medición."}
        </p>
      ) : (
        <p className="mt-2 text-base text-ink-muted">Completa ambos valores para ver la comparación.</p>
      )}
    </section>
  );
}
