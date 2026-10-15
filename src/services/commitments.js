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
