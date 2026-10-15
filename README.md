# Compromisos

Convierte minutas, chats y correos en compromisos con responsable, fecha y la frase que los respalda.
Stack: React + Vite + Tailwind, Supabase (Postgres, Auth, Edge Functions) y Vercel.

El plan, el diseño y el avance están en `.kiro/specs/tracker-compromisos/` (requirements, design, tasks).

## Ramas
- `main`: producción. Contiene la base del proyecto.
- `feature/inicio-sesion`: spec, migración de la tabla y pantalla de inicio de sesión.

## Variables de entorno
Solo dos, ambas públicas por diseño (los datos los protege RLS):

| Variable | Dónde está |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |

Localmente van en `.env.local` (copia `.env.example`). En Vercel van en Settings → Environment Variables, marcadas para Production, Preview y Development.

## Desarrollo local
```bash
npm install
npm run dev
```
