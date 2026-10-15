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
