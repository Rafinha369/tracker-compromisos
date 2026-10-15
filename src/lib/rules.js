// Reglas deterministas: aquí no participa la IA.
import { normalize } from "./text.js";

export const CONFIDENCE_THRESHOLD = 0.8;
export const DUPLICATE_THRESHOLD = 0.6;

const STOPWORDS = new Set(
  "a al ante antes con de del el en la las lo los para por que se su sus un una y o e u le les mas muy ya hoy esta este".split(" ")
);

export function tokens(text) {
  return new Set(normalize(text).split(" ").filter((t) => t.length > 2 && !STOPWORDS.has(t)));
}

export function jaccard(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  ta.forEach((t) => tb.has(t) && shared++);
  return shared / (ta.size + tb.size - shared);
}

// La frase de origen debe existir en las notas: evita que la IA invente evidencia.
export function sourceExists(sentence, notes) {
  const s = normalize(sentence);
  if (!s) return false;
  if (normalize(notes).includes(s)) return true;
  const noteTokens = tokens(notes);
  const words = [...tokens(sentence)];
  if (words.length < 4) return false;
  return words.filter((t) => noteTokens.has(t)).length / words.length >= 0.85;
}

export function isValidISODate(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function dateStatus(dueDate, referenceDate) {
  if (!dueDate) return "falta";
  if (!isValidISODate(dueDate)) return "invalida";
  if (isValidISODate(referenceDate) && dueDate < referenceDate) return "pasada";
  return "ok";
}

function sameOwner(a, b) {
  if (!a || !b) return true; // si falta uno, no descartamos el duplicado por responsable
  return normalize(a).split(" ")[0] === normalize(b).split(" ")[0];
}

export function findDuplicate(item, existing) {
  let best = null;
  for (const e of existing) {
    if (!sameOwner(item.owner, e.owner)) continue;
    const score = jaccard(item.action, e.action);
    if (score >= DUPLICATE_THRESHOLD && (!best || score > best.score)) best = { ...e, score };
  }
  return best ? { id: best.id, action: best.action } : null;
}

// Verifica cada ítem y decide su grupo: listo, revision o no_accionable.
export function reviewItems(items, notes, meetingDate, existing) {
  const pool = existing.map((c) => ({ id: c.id, action: c.action, owner: c.owner_name }));
  return items.map((item) => {
    const checks = {
      sourceFound: sourceExists(item.sourceSentence, notes),
      ownerPresent: Boolean(item.owner && item.owner.trim().length > 1),
      dateStatus: dateStatus(item.dueDate, meetingDate),
      duplicateOf: null,
    };
    const flags = [];
    if (item.kind === "compromiso") {
      checks.duplicateOf = findDuplicate(item, pool);
      pool.push({ id: `lote:${item.tempId}`, action: item.action, owner: item.owner });
      if (!checks.sourceFound) flags.push("La frase de origen no aparece en las notas");
      if (!checks.ownerPresent) flags.push("Sin responsable");
      if (checks.dateStatus === "falta") flags.push("Sin fecha límite");
      if (checks.dateStatus === "invalida") flags.push("Fecha inválida");
      if (checks.dateStatus === "pasada") flags.push("Fecha anterior a la reunión");
      if (checks.duplicateOf) {
        const where = checks.duplicateOf.id.startsWith("lote:") ? "dentro de estas notas" : "en el tracker";
        flags.push(`Posible duplicado ${where}: "${checks.duplicateOf.action}"`);
      }
      if (item.confidence < CONFIDENCE_THRESHOLD) flags.push(`Confianza baja (${Math.round(item.confidence * 100)} %)`);
      if (item.needsClarification) flags.push(item.clarificationReason || "La IA pide aclaración");
    }
    const route = item.kind !== "compromiso" ? "no_accionable" : flags.length ? "revision" : "listo";
    return { ...item, checks, flags, route };
  });
}

// Validación antes de guardar: devuelve el mensaje de error o null.
export function validateForApproval(item) {
  if (!item.action || item.action.trim().length < 3) return "Escribe qué hay que hacer.";
  if (!item.owner || item.owner.trim().length < 2) return "Asigna un responsable antes de aprobar.";
  if (item.dueDate && !isValidISODate(item.dueDate)) return "La fecha no es válida.";
  return null;
}
