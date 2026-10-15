import { useState } from "react";
import { EVALUATION_SAMPLES } from "../data/evaluationSamples";
import { extractCommitments } from "../services/extraction";
import { aggregate, scoreSample } from "../lib/evaluate";

export function useEvaluation() {
  const [status, setStatus] = useState("idle"); // idle | running | error | done
  const [done, setDone] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function run() {
    setStatus("running");
    setDone(0);
    setError(null);
    const started = performance.now();

    const outcomes = await Promise.all(
      EVALUATION_SAMPLES.map(async (sample) => {
        const t0 = performance.now();
        const { data, error } = await extractCommitments(sample);
        setDone((n) => n + 1);
        return { sample, error, ms: performance.now() - t0, items: data?.items ?? [] };
      })
    );

    const failed = outcomes.find((o) => o.error);
    if (failed) {
      setError({ message: `Falló la extracción de “${failed.sample.title}”: ${failed.error.message}` });
      setStatus("error");
      return;
    }
    const samples = outcomes.map((o) => ({ ...o, score: scoreSample(o.sample.gold, o.items) }));
    setResult({
      samples,
      summary: aggregate(samples.map((s) => s.score)),
      totalMs: performance.now() - started,
    });
    setStatus("done");
  }

  return { status, done, total: EVALUATION_SAMPLES.length, result, error, run };
}
