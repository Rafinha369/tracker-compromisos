import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregate, scoreSample } from "./evaluate.js";

const gold = [
  { anchor: "mapeo de la columna", owner: "Diego Rojas", dueDate: "2026-10-14" },
  { anchor: "falla la carga automatica", owner: null, dueDate: null },
];
const item = (patch) => ({ kind: "compromiso", action: "", sourceSentence: "", owner: null, dueDate: null, ...patch });

test("cuenta aciertos, responsable, fecha, faltantes y falsos", () => {
  const s = scoreSample(gold, [
    item({ sourceSentence: 'Diego va a corregir el mapeo de la columna "HE_50"', owner: "Diego", dueDate: "2026-10-15" }),
    item({ sourceSentence: "Podríamos automatizar el envío", action: "Automatizar envío" }),
    { kind: "idea", action: "Filtro por turno", sourceSentence: "Sería bueno" },
  ]);
  assert.equal(s.matches.length, 1);
  assert.equal(s.matches[0].ownerOk, true);
  assert.equal(s.matches[0].dateOk, false);
  assert.equal(s.missed.length, 1);
  assert.equal(s.falseCommitments.length, 1);
});

test("responsable nulo esperado solo acierta si la IA tampoco inventa uno", () => {
  const ok = scoreSample(gold.slice(1), [item({ sourceSentence: "por qué falla la carga automática" })]);
  const bad = scoreSample(gold.slice(1), [item({ sourceSentence: "por qué falla la carga automática", owner: "Andrea" })]);
  assert.equal(ok.matches[0].ownerOk, true);
  assert.equal(bad.matches[0].ownerOk, false);
});

test("agregado de precisión y recall", () => {
  const a = aggregate([scoreSample(gold, [item({ sourceSentence: "el mapeo de la columna" }), item({ action: "otra cosa" })])]);
  assert.equal(a.precision, 0.5);
  assert.equal(a.recall, 0.5);
});
