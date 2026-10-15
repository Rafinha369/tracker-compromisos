// Normaliza texto para comparar sin importar mayúsculas, tildes ni puntuación.
export function normalize(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function formatShortDate(iso) {
  if (!iso) return "Sin fecha";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("es-CL", { day: "numeric", month: "short" });
}

export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// Número con un decimal en formato chileno: 8,4
export function formatDecimal(n) {
  return n.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
