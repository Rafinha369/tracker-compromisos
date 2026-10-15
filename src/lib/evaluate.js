// Comparación determinista entre lo que extrajo la IA y las etiquetas de los textos de prueba.
import { normalize } from "./text.js";

function ownerMatches(gold, predicted) {
  if (gold === null) return !predicted;
  if (!predicted) return false;
  return normalize(predicted).split(" ")[0] === normalize(gold).split(" ")[0];
}

// Empareja cada compromiso esperado con uno propuesto cuya frase u acción contenga el fragmento ("anchor").
export function scoreSample(gold, items) {
  const predicted = items.filter((i) => i.kind === "compromiso");
  const used = new Set();
  const matches = [];
  const missed = [];

  for (const g of gold) {
    const anchor = normalize(g.anchor);
    const idx = predicted.findIndex((p, i) => !used.has(i) && normalize(`${p.sourceSentence} ${p.action}`).includes(anchor));
    if (idx === -1) {
      missed.push(g);
      continue;
    }
    used.add(idx);
    const p = predicted[idx];
    matches.push({
      gold: g,
      predicted: p,
      ownerOk: ownerMatches(g.owner, p.owner),
      dateOk: (g.dueDate ?? null) === (p.dueDate ?? null),
    });
  }

  return {
    gold: gold.length,
    predicted: predicted.length,
    matches,
    missed,
    falseCommitments: predicted.filter((_, i) => !used.has(i)),
  };
}

export function aggregate(scores) {
  const gold = scores.reduce((a, s) => a + s.gold, 0);
  const predicted = scores.reduce((a, s) => a + s.predicted, 0);
  const matches = scores.flatMap((s) => s.matches);
  const found = matches.length;
  return {
    gold,
    predicted,
    found,
    precision: predicted ? found / predicted : 0,
    recall: gold ? found / gold : 0,
    ownerCorrect: matches.filter((m) => m.ownerOk).length,
    dateCorrect: matches.filter((m) => m.dateOk).length,
    falseCommitments: scores.reduce((a, s) => a + s.falseCommitments.length, 0),
  };
}
