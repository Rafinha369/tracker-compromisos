import { FunctionsFetchError, FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

// Llama a la Edge Function que consulta a la IA. Devuelve { data, error }.
export async function extractCommitments({ notes, title, meetingDate }) {
  const { data, error } = await supabase.functions.invoke("extract-commitments", {
    body: { notes, title, meetingDate },
  });
  if (!error) return { data, error: null };

  if (error instanceof FunctionsHttpError) {
    const status = error.context?.status;
    const body = await error.context?.json?.().catch(() => null);
    if (status === 404)
      return { data: null, error: { message: "La función extract-commitments no está desplegada en Supabase.", aiUnavailable: true } };
    return {
      data: null,
      error: { message: body?.error ?? `La extracción falló (código ${status}).`, aiUnavailable: body?.aiUnavailable ?? status >= 500 },
    };
  }
  if (error instanceof FunctionsFetchError)
    return { data: null, error: { message: "No se pudo contactar la función de extracción. Revisa tu conexión.", aiUnavailable: true } };
  return { data: null, error: { message: error.message, aiUnavailable: true } };
}
