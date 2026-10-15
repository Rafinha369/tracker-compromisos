import { test } from "node:test";
import assert from "node:assert/strict";
import { dateStatus, findDuplicate, reviewItems, sourceExists, validateForApproval } from "./rules.js";

const notes = 'Diego va a corregir el mapeo de la columna "HE_50" antes del miércoles 14.';
const base = {
  tempId: "i0", kind: "compromiso", action: "Corregir el mapeo de la columna HE_50", owner: "Diego Rojas",
  dueDate: "2026-10-14", sourceSentence: notes, confidence: 0.95, needsClarification: false, clarificationReason: null,
};

test("la frase de origen debe existir en las notas", () => {
  assert.equal(sourceExists(base.sourceSentence, notes), true);
  assert.equal(sourceExists("Diego enviará el informe de vacaciones a gerencia", notes), false);
});

test("duplicados por similitud y mismo responsable", () => {
  const existing = [{ id: "1", action: "Corregir el mapeo de la columna HE_50", owner: "Diego Rojas" }];
  assert.equal(findDuplicate({ action: "Corregir mapeo columna HE_50", owner: "Diego" }, existing)?.id, "1");
  assert.equal(findDuplicate({ action: "Corregir mapeo columna HE_50", owner: "Carla" }, existing), null);
});

test("fechas", () => {
  assert.equal(dateStatus("2026-02-30", "2026-01-01"), "invalida");
  assert.equal(dateStatus("2026-10-01", "2026-10-12"), "pasada");
  assert.equal(dateStatus(null, "2026-10-12"), "falta");
});

test("grupos: completo va a listo; sin responsable a revisión; idea a no accionable", () => {
  assert.equal(reviewItems([base], notes, "2026-10-12", [])[0].route, "listo");
  assert.equal(reviewItems([{ ...base, owner: null }], notes, "2026-10-12", [])[0].route, "revision");
  assert.equal(reviewItems([{ ...base, kind: "idea" }], notes, "2026-10-12", [])[0].route, "no_accionable");
  const dup = reviewItems([base], notes, "2026-10-12", [{ id: "x", action: base.action, owner_name: "Diego Rojas" }]);
  assert.equal(dup[0].route, "revision");
});

test("validación antes de aprobar", () => {
  assert.match(validateForApproval({ ...base, owner: "" }), /responsable/);
  assert.equal(validateForApproval(base), null);
});
