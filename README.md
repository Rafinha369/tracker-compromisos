# Compromisos

Convierte minutas, chats y correos en compromisos con responsable, fecha y la frase que los respalda.
Stack: React + Vite + Tailwind, Supabase (Postgres, Auth, Edge Functions) y Vercel.

El plan, el diseño y el avance están en `.kiro/specs/tracker-compromisos/` (requirements, design, tasks).

## Pantallas
- `/login`: crear cuenta e iniciar sesión.
- `/`: Extraer y revisar. La IA propone; la persona aprueba.
- `/tracker`: estados, vencidos, evidencia e historial.
- `/metricas`: evaluación contra 3 textos etiquetados y comparación de tiempo.

## Supabase
1. SQL Editor: ejecutar en orden `supabase/migrations/001_create_commitments.sql` y `002_enforce_commitment_status.sql` (pegar el contenido).
2. Edge Functions: desplegar `supabase/functions/extract-commitments/index.ts` con el nombre `extract-commitments`.
3. Edge Functions → Secrets: `OPENROUTER_API_KEY` (y opcional `OPENROUTER_MODEL`).
4. Authentication → URL Configuration: Site URL = URL de producción de Vercel; Redirect URLs = `https://*.vercel.app/**`.

## Vercel
Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para Production, Preview y Development. Son públicas por diseño: los datos los protege RLS.

## Desarrollo local
```bash
npm install
npm run dev
npm test
```
