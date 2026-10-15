import { supabase } from "../lib/supabase";

function friendly(error, action) {
  return error ? { ...error, message: `No se pudo ${action}: ${error.message}` } : null;
}

// Compromisos activos del usuario (RLS limita a los propios); se usan para detectar duplicados.
export async function listActiveCommitments() {
  const { data, error } = await supabase
    .from("commitments")
    .select("id, action, owner_name, status")
    .neq("status", "cancelado");
  return { data: data ?? [], error: friendly(error, "leer tus compromisos") };
}

export async function createCommitment(item, sourceTitle) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("commitments")
    .insert({
      action: item.action.trim(),
      owner_name: item.owner.trim(),
      due_date: item.dueDate || null,
      dependency: item.dependency?.trim() || null,
      priority: item.priority,
      source_sentence: item.sourceSentence ?? "",
      source_title: sourceTitle?.trim() || "Notas sin título",
      confidence: item.confidence ?? 1,
      history: [{ at: now, from: null, to: "pendiente", note: item.manual ? "Creado a mano" : "Aprobado desde revisión" }],
    })
    .select("id, action, owner_name, status")
    .single();
  return { data, error: friendly(error, "guardar el compromiso") };
}

const TRACKER_FIELDS =
  "id, action, owner_name, due_date, dependency, priority, source_sentence, source_title, status, evidence, history, created_at";

// Todos los compromisos del usuario, ordenados por fecha límite (sin fecha al final).
export async function listCommitments() {
  const { data, error } = await supabase
    .from("commitments")
    .select(TRACKER_FIELDS)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true });
  return { data: data ?? [], error: friendly(error, "cargar el tracker") };
}

// Cambia el estado y agrega la entrada al historial.
// Solo actualiza si el estado no cambió desde que se leyó (evita pisar cambios de otra pestaña).
export async function changeCommitmentStatus(commitment, to, { evidence = null, note = null } = {}) {
  const entry = { at: new Date().toISOString(), from: commitment.status, to, note: note?.trim() || null };
  const patch = { status: to, history: [...(commitment.history ?? []), entry] };
  if (to === "completado") patch.evidence = evidence.trim();

  const { data, error } = await supabase
    .from("commitments")
    .update(patch)
    .eq("id", commitment.id)
    .eq("status", commitment.status)
    .select(TRACKER_FIELDS)
    .maybeSingle();
  if (error) return { data: null, error: friendly(error, "cambiar el estado") };
  if (!data)
    return { data: null, error: { message: "Este compromiso cambió mientras lo veías. Recarga el tracker e intenta de nuevo." } };
  return { data, error: null };
}
