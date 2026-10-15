import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { usePageTitle } from "../hooks/usePageTitle";
import BrandMark from "../components/BrandMark";
import EvidencePreview from "../components/EvidencePreview";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  usePageTitle("Iniciar sesión");
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const target = location.state?.from ?? "/";

  if (!loading && session) return <Navigate to={target} replace />;

  // En móvil: título, formulario y luego la minuta. En escritorio: minuta a la izquierda, formulario a la derecha.
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[3fr_2fr] lg:grid-rows-[auto_1fr]">
      <section className="px-4 pt-8 md:px-12 md:pt-16 lg:col-start-1 lg:row-start-1">
        <BrandMark dark />
        <h1 className="mt-12 max-w-xl font-display text-xl font-extrabold md:text-2xl">
          Cada compromiso de la reunión, con responsable, fecha y la frase que lo prueba.
        </h1>
        <p className="mt-4 max-w-xl text-base text-ink-muted md:text-lg">
          Pegas la minuta, el chat o el correo. La IA propone los compromisos y tú apruebas cuáles entran al seguimiento.
        </p>
      </section>

      <section className="mt-8 border-y border-line bg-sheet px-4 py-8 md:px-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:border-y-0 lg:border-l lg:py-16">
        <div className="lg:sticky lg:top-16">
          <h2 className="font-display text-lg font-bold">Entra a tu tracker</h2>
          <p className="mb-6 mt-1 text-sm text-ink-muted">Cada cuenta ve solo sus propios compromisos.</p>
          <LoginForm onSignedIn={() => navigate(target, { replace: true })} />
        </div>
      </section>

      <section className="px-4 py-8 md:px-12 md:pb-16 lg:col-start-1 lg:row-start-2">
        <EvidencePreview />
      </section>
    </main>
  );
}
