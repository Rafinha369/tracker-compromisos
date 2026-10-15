import { LoaderCircle, Play, RotateCw } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useEvaluation } from "../hooks/useEvaluation";
import DecisionBoundary from "../components/DecisionBoundary";
import EvaluationSet from "../components/EvaluationSet";
import SampleResults from "../components/SampleResults";
import Scoreboard from "../components/Scoreboard";
import TimeComparison from "../components/TimeComparison";

export default function MetricsPage() {
  usePageTitle("Métricas");
  const { status, done, total, result, error, run } = useEvaluation();
  const running = status === "running";

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
      <div>
        <h1 className="font-display text-xl font-extrabold md:text-2xl">Métricas</h1>
        <p className="mt-2 max-w-2xl text-base text-ink-muted">
          La extracción se mide contra 3 textos sintéticos con los compromisos marcados a mano. Cada evaluación consulta a la IA
          3 veces y usa créditos de OpenRouter. Los resultados pueden variar levemente entre ejecuciones.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button onClick={run} disabled={running}
            className="inline-flex items-center gap-2 rounded bg-accent px-6 py-3 text-base font-semibold text-sheet hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
            {running ? <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" />
              : status === "idle" ? <Play size={18} aria-hidden="true" /> : <RotateCw size={18} aria-hidden="true" />}
            {running ? `Evaluando… ${done} de ${total} textos` : status === "idle" ? "Ejecutar evaluación" : "Ejecutar de nuevo"}
          </button>
          {running && <span className="text-sm text-ink-muted" role="status">Suele tardar entre 15 y 40 segundos.</span>}
        </div>
      </div>

      {status === "error" && (
        <p className="border-l-4 border-bad bg-sheet px-4 py-3 text-base text-bad" role="alert">{error.message}</p>
      )}

      {status === "done" ? (
        <>
          <Scoreboard summary={result.summary} />
          <section>
            <h2 className="mb-4 font-display text-lg font-bold">Errores observados por texto</h2>
            <SampleResults samples={result.samples} />
          </section>
          <TimeComparison aiMs={result.totalMs} />
        </>
      ) : (
        <section>
          <h2 className="mb-4 font-display text-lg font-bold">Set de prueba</h2>
          <EvaluationSet />
        </section>
      )}

      <DecisionBoundary />
    </main>
  );
}
