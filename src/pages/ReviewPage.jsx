import { FileText } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

// Pantalla en construcción: la siguiente iteración agrega la extracción y la cola de revisión.
export default function ReviewPage() {
  usePageTitle("Extraer y revisar");
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-16">
      <h1 className="font-display text-xl font-extrabold md:text-2xl">Extraer y revisar</h1>
      <div className="mt-8 flex max-w-xl items-start gap-4 border border-dashed border-line bg-sheet px-6 py-8">
        <FileText size={24} className="mt-1 shrink-0 text-ink-muted" aria-hidden="true" />
        <div>
          <p className="text-base font-semibold">Iniciaste sesión correctamente.</p>
          <p className="mt-1 text-base text-ink-muted">
            Aquí vas a pegar notas para extraer compromisos. Esta pantalla llega en la próxima entrega.
          </p>
        </div>
      </div>
    </main>
  );
}
