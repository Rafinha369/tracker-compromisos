import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import FullScreenMessage from "./components/FullScreenMessage";

const root = createRoot(document.getElementById("root"));
const missing = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"].filter((k) => !import.meta.env[k]);

// Sin variables de Supabase la app no puede arrancar: mostramos qué falta en vez de una pantalla en blanco.
if (missing.length) {
  root.render(
    <FullScreenMessage title="Falta configurar Supabase" tone="error">
      Agrega {missing.join(" y ")} en .env.local (local) o en Vercel → Settings → Environment Variables, y vuelve a desplegar.
    </FullScreenMessage>
  );
} else {
  import("./App.jsx").then(({ default: App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    )
  );
}
