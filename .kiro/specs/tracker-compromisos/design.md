# Diseño técnico

## Stack
React + Vite + Tailwind (JavaScript), Supabase (Postgres, Auth, Edge Functions), Vercel.

## Datos
Tabla `commitments` (migración `001_create_commitments.sql`):
id, user_id, action, owner_name, due_date, dependency, priority, source_sentence, source_title, confidence, status, evidence, history (jsonb), created_at, updated_at.

RLS: cada usuario lee, crea, edita y borra solo filas con `auth.uid() = user_id`. Los valores de `priority` y `status` se validan con `check` en la base.

Trigger `commitments_enforce_status` (migración `002_enforce_commitment_status.sql`): antes de cada update valida la transición de estado, exige evidencia (5+ caracteres) para completar y actualiza `updated_at`. La interfaz aplica las mismas reglas para ofrecer solo cambios válidos; la base es la barrera final.

Cambio de estado protegido: el update filtra por `id` y por el estado leído; si otra pestaña ya lo cambió, no se pisa y la interfaz pide recargar.

## IA
Edge Function `extract-commitments` (`supabase/functions/extract-commitments/index.ts`, JavaScript sin tipos).
- Comprueba la sesión llamando a `/auth/v1/user` con el token del usuario; sin sesión responde 401.
- Llama a OpenRouter con los secretos `OPENROUTER_API_KEY` y `OPENROUTER_MODEL` (por defecto `anthropic/claude-sonnet-4.5`), con una herramienta para obtener salida estructurada.
- Sanea la respuesta (tipos, rangos, valores permitidos) y devuelve `{ items, model, ms }`. Errores de la IA devuelven `aiUnavailable: true` para ofrecer la carga manual.
- No escribe en la base: guardar es decisión de la persona y pasa por RLS desde el frontend.

## Reglas deterministas (src/lib/rules.js, se ejecutan en el navegador)
Normalización de texto, verificación de frase de origen, validación de fechas, duplicados (Jaccard ≥ 0,6 + mismo responsable), umbral de confianza 0,8, máquina de estados y exigencia de evidencia.

## Métricas
La pantalla llama 3 veces a `extract-commitments` (una por texto de `src/data/evaluationSamples.js`) y calcula en el navegador, con `src/lib/evaluate.js`, precisión, recall, responsable y fecha correctos y compromisos falsos. Un compromiso propuesto cuenta como encontrado si su frase o acción contiene el fragmento (`anchor`) etiquetado. No guarda resultados ni crea tablas.

## Frontend
- Rutas: /login (pública); / Extraer y revisar, /tracker, /metricas (privadas, con ProtectedRoute).
- Sesión: AuthProvider con getSession al cargar y onAuthStateChange.
- Acceso a datos solo desde src/services/, que devuelven { data, error }.

## Diseño visual
Paleta: Papel frío #E8ECEF, Hoja #FFFFFF, Tinta #17212B, Azul tinta #24497A, Resaltador #F6DE55, Grafito claro #C7CFD6.
Tipografía: Schibsted Grotesk (títulos), Public Sans (cuerpo). Escala 14/16/20/28/40/64.
Elemento firma: el resaltador sobre la frase de origen.

## Datos fijos
src/data/evaluationSamples.js contiene los textos sintéticos etiquetados de la evaluación. No reemplaza a una tabla: es el set de prueba y permanece.
