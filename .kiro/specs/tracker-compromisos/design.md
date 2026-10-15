# Diseño técnico

## Stack
React + Vite + Tailwind (JavaScript), Supabase (Postgres, Auth, Edge Functions), Vercel.

## Datos
Tabla `commitments` (migración `001_create_commitments.sql`):
id, user_id, action, owner_name, due_date, dependency, priority, source_sentence, source_title, confidence, status, evidence, history (jsonb), created_at, updated_at.

RLS: cada usuario lee, crea, edita y borra solo filas con `auth.uid() = user_id`. Los valores de `priority` y `status` se validan con `check` en la base.

## IA
Edge Function `extract-commitments` (iteración 2). Recibe notas, título y fecha; llama a OpenRouter con `OPENROUTER_API_KEY` guardada como secreto de Supabase; devuelve ítems estructurados. Exige un usuario con sesión. La clave nunca llega al navegador.

## Reglas deterministas (src/lib/rules.js)
Normalización de texto, verificación de frase de origen, validación de fechas, duplicados (Jaccard ≥ 0,6 + mismo responsable), umbral de confianza 0,8, máquina de estados y exigencia de evidencia.

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
