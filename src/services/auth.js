import { supabase } from "../lib/supabase";

// Traduce los errores de Supabase Auth a mensajes claros en español.
const MESSAGES = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "User already registered": "Ya existe una cuenta con ese email. Inicia sesión.",
  "Email not confirmed": "Confirma tu email con el enlace que te enviamos antes de entrar.",
  "Password should be at least 6 characters.": "La contraseña debe tener al menos 6 caracteres.",
};

function translate(error) {
  if (!error) return null;
  return { ...error, message: MESSAGES[error.message] ?? `No se pudo completar: ${error.message}` };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data: data?.session ?? null, error: translate(error) };
}

export function onSessionChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error: translate(error) };
}

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin },
  });
  return { data, error: translate(error) };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { data: null, error: translate(error) };
}
