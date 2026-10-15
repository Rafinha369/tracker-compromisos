// Edge Function: recibe notas y devuelve los ítems detectados por la IA.
// La clave de OpenRouter vive como secreto en Supabase y nunca llega al navegador.
// Solo interpreta texto; las reglas (duplicados, fechas, rutas) se aplican en el frontend.

const OPENROUTER_URL = (Deno.env.get("OPENROUTER_BASE_URL") ?? "https://openrouter.ai/api/v1") + "/chat/completions";
const MODEL = Deno.env.get("OPENROUTER_MODEL") ?? "anthropic/claude-sonnet-4.5";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM = `Eres un analista de operaciones que lee notas de reunión, hilos de chat y correos de un equipo de RR.HH. y remuneraciones.
Identifica cada enunciado relevante y clasifícalo:
- "compromiso": alguien (o un rol) queda a cargo de hacer algo concreto. Incluye pedidos explícitos a una persona ("Sebastián, ¿puedes cruzarlo antes del 28?").
- "decision": se acordó una regla o resultado, sin tarea pendiente.
- "idea": propuesta o deseo sin dueño ni compromiso ("podríamos", "sería bueno", "quizás convenga").
- "pregunta": duda abierta sin responsable.

Reglas estrictas:
1. "frase_origen" es una copia TEXTUAL y exacta de la oración de las notas que respalda el ítem. No la parafrasees.
2. No inventes responsables. Si el texto dice "alguien de TI" o no nombra a nadie, responsable = null y requiere_aclaracion = true. Usa el nombre completo si aparece en asistentes o firma.
3. Convierte fechas relativas a YYYY-MM-DD con la fecha de la reunión como referencia ("el viernes" = el próximo viernes; "mañana" = día siguiente; "esta semana" = viernes de esa semana). Si no hay fecha concreta, fecha_limite = null y explica en motivo_aclaracion.
4. "confianza" (0 a 1) indica qué tan seguro estás de que es un compromiso real con ese responsable y esa fecha.
5. Prioridad "alta" si hay urgencia, auditoría, cierre o bloqueo; "baja" si es opcional; "media" en otro caso.
6. Si la tarea depende de otra persona o aprobación, descríbelo en "dependencia".
Registra todos los ítems con la herramienta registrar_items.`;

const TOOL = {
  type: "function",
  function: {
    name: "registrar_items",
    description: "Registra los ítems detectados en las notas.",
    parameters: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              tipo: { type: "string", enum: ["compromiso", "decision", "idea", "pregunta"] },
              accion: { type: "string", description: "Qué hay que hacer, en infinitivo y breve." },
              responsable: { type: ["string", "null"] },
              fecha_limite: { type: ["string", "null"], description: "YYYY-MM-DD o null" },
              fecha_texto: { type: ["string", "null"] },
              dependencia: { type: ["string", "null"] },
              prioridad: { type: "string", enum: ["alta", "media", "baja"] },
              frase_origen: { type: "string" },
              confianza: { type: "number" },
              requiere_aclaracion: { type: "boolean" },
              motivo_aclaracion: { type: ["string", "null"] },
            },
            required: ["tipo", "accion", "responsable", "fecha_limite", "prioridad", "frase_origen", "confianza", "requiere_aclaracion"],
          },
        },
      },
      required: ["items"],
    },
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}

// Comprueba con Supabase Auth que quien llama tiene una sesión real (no basta con la clave anon).
async function getUser(req) {
  const auth = req.headers.get("Authorization") ?? "";
  const apikey = req.headers.get("apikey") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";
  if (!auth.startsWith("Bearer ")) return null;
  const res = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, { headers: { Authorization: auth, apikey } });
  if (!res.ok) return null;
  const user = await res.json();
  return user?.id ? user : null;
}

function text(v) {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

// Saneamiento de la salida del modelo: tipos, rangos y valores permitidos.
function sanitize(raw) {
  const kinds = ["compromiso", "decision", "idea", "pregunta"];
  const priorities = ["alta", "media", "baja"];
  return raw.map((o, i) => ({
    tempId: `i${i}`,
    kind: kinds.includes(o?.tipo) ? o.tipo : "idea",
    action: text(o?.accion) ?? "(sin descripción)",
    owner: text(o?.responsable),
    dueDate: text(o?.fecha_limite),
    dueDateText: text(o?.fecha_texto),
    dependency: text(o?.dependencia),
    priority: priorities.includes(o?.prioridad) ? o.prioridad : "media",
    sourceSentence: text(o?.frase_origen) ?? "",
    confidence: typeof o?.confianza === "number" ? Math.min(1, Math.max(0, o.confianza)) : 0,
    needsClarification: o?.requiere_aclaracion === true,
    clarificationReason: text(o?.motivo_aclaracion),
  }));
}

// Lee los ítems desde la llamada a la herramienta; si el modelo respondió en texto, intenta leer JSON.
function parseItems(data) {
  const msg = data?.choices?.[0]?.message;
  const call = msg?.tool_calls?.find((t) => t?.function?.name === "registrar_items") ?? msg?.tool_calls?.[0];
  for (const candidate of [call?.function?.arguments, msg?.content]) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;
    try {
      const parsed = JSON.parse(candidate.replace(/```json|```/g, "").trim());
      if (Array.isArray(parsed?.items)) return parsed.items;
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // probar el siguiente candidato
    }
  }
  return null;
}

async function callOpenRouter(notes, title, meetingDate) {
  const key = Deno.env.get("OPENROUTER_API_KEY");
  if (!key) return { error: "Falta el secreto OPENROUTER_API_KEY en Supabase.", status: 503 };

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "Tracker de compromisos" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      temperature: 0,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: `Fecha de la reunión: ${meetingDate}\nTítulo: ${title || "(sin título)"}\n\n<notas>\n${notes}\n</notas>` },
      ],
      tools: [TOOL],
      tool_choice: { type: "function", function: { name: "registrar_items" } },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) return { error: "OpenRouter rechazó la clave. Revisa el secreto OPENROUTER_API_KEY.", status: 503 };
  if (res.status === 402) return { error: "La cuenta de OpenRouter no tiene créditos.", status: 503 };
  if (!res.ok || data.error) return { error: `OpenRouter respondió con error: ${data.error?.message ?? res.status}`, status: 503 };

  const raw = parseItems(data);
  if (!raw) return { error: "La IA respondió en un formato que no se pudo leer. Intenta de nuevo.", status: 502 };
  return { items: sanitize(raw) };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Usa POST." }, 405);

  const user = await getUser(req);
  if (!user) return json({ error: "Inicia sesión para extraer compromisos." }, 401);

  const body = await req.json().catch(() => null);
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 200) : "";
  const meetingDate = /^\d{4}-\d{2}-\d{2}$/.test(body?.meetingDate ?? "") ? body.meetingDate : new Date().toISOString().slice(0, 10);
  if (notes.length < 20) return json({ error: "Pega notas de al menos 20 caracteres." }, 400);
  if (notes.length > 15000) return json({ error: "Las notas superan 15.000 caracteres. Divídelas en partes." }, 400);

  const started = Date.now();
  try {
    const result = await callOpenRouter(notes, title, meetingDate);
    if (result.error) return json({ error: result.error, aiUnavailable: true }, result.status);
    return json({ items: result.items, model: MODEL, ms: Date.now() - started });
  } catch (e) {
    return json({ error: `No se pudo contactar a OpenRouter: ${e?.message ?? "error de red"}.`, aiUnavailable: true }, 503);
  }
});
