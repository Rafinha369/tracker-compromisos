import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LoaderCircle, RotateCw } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";
import { useCommitments } from "../hooks/useCommitments";
import { STATUS_LABEL, isOpen, isOverdue } from "../lib/rules";
import { todayISO } from "../lib/text";
import CommitmentRow from "../components/CommitmentRow";
import StatusDialog from "../components/StatusDialog";
import TrackerFilters from "../components/TrackerFilters";

const NEEDS_DIALOG = ["completado", "bloqueado", "cancelado"];

export default function TrackerPage() {
  usePageTitle("Tracker");
  const today = todayISO();
  const { items, status, error, reload, changeStatus } = useCommitments();
  const [filter, setFilter] = useState("abiertos");
  const [owner, setOwner] = useState("");
  const [pending, setPending] = useState(null); // { commitment, to } mientras el diálogo está abierto
  const [messages, setMessages] = useState({});
  const [notice, setNotice] = useState(null);

  const counts = useMemo(() => ({
    abiertos: items.filter((c) => isOpen(c.status)).length,
    vencidos: items.filter((c) => isOverdue(c, today)).length,
    bloqueado: items.filter((c) => c.status === "bloqueado").length,
    completado: items.filter((c) => c.status === "completado").length,
    todos: items.length,
  }), [items, today]);
  const owners = useMemo(() => [...new Set(items.map((c) => c.owner_name))].sort(), [items]);

  const visible = items.filter((c) => {
    if (owner && c.owner_name !== owner) return false;
    if (filter === "abiertos") return isOpen(c.status);
    if (filter === "vencidos") return isOverdue(c, today);
    if (filter === "todos") return true;
    return c.status === filter;
  });

  // Confirma el cambio; si el compromiso sale del filtro actual, lo dice para que no "desaparezca" sin aviso.
  function announce(commitment, to) {
    const hidden = filter === "abiertos" && !isOpen(to);
    setNotice(`“${commitment.action}” quedó como ${STATUS_LABEL[to].toLowerCase()}${hidden ? `. Lo encuentras en el filtro ${to === "completado" ? "Completados" : "Todos"}.` : "."}`);
  }

  async function requestStatus(commitment, to) {
    setMessages((m) => ({ ...m, [commitment.id]: null }));
    setNotice(null);
    if (NEEDS_DIALOG.includes(to)) return setPending({ commitment, to });
    const message = await changeStatus(commitment, to);
    if (message) setMessages((m) => ({ ...m, [commitment.id]: message }));
    else announce(commitment, to);
  }

  async function confirmPending(details) {
    const message = await changeStatus(pending.commitment, pending.to, details);
    if (!message) {
      announce(pending.commitment, pending.to);
      setPending(null);
    }
    return message;
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-xl font-extrabold md:text-2xl">Tracker</h1>
      <p className="mt-2 max-w-2xl text-base text-ink-muted">
        Tus compromisos aprobados. Un compromiso solo se cierra con evidencia, y cada cambio queda en el historial.
      </p>

      {status === "loading" && (
        <p className="mt-8 flex items-center gap-2 text-base text-ink-muted" role="status">
          <LoaderCircle size={18} className="motion-safe:animate-spin" aria-hidden="true" /> Cargando tus compromisos…
        </p>
      )}

      {status === "error" && (
        <div className="mt-8 border-l-4 border-bad bg-sheet px-4 py-4" role="alert">
          <p className="text-base text-bad">{error.message}</p>
          <button onClick={reload} className="mt-2 inline-flex items-center gap-2 rounded border border-line px-3 py-1 font-semibold hover:border-ink">
            <RotateCw size={16} aria-hidden="true" /> Reintentar
          </button>
        </div>
      )}

      {status === "ready" && items.length === 0 && (
        <div className="mt-8 border border-dashed border-line bg-sheet p-8">
          <p className="text-base font-semibold">Todavía no tienes compromisos en el tracker.</p>
          <p className="mt-1 text-base text-ink-muted">Se agregan cuando apruebas ítems en la revisión.</p>
          <Link to="/" className="mt-4 inline-block rounded bg-accent px-4 py-2 font-semibold text-sheet hover:bg-accent-hover">
            Extraer compromisos de unas notas
          </Link>
        </div>
      )}

      {status === "ready" && items.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {notice && <p className="border-l-4 border-ok bg-sheet px-4 py-2 text-base" role="status">{notice}</p>}
          <TrackerFilters filter={filter} onFilter={setFilter} counts={counts} owners={owners} owner={owner} onOwner={setOwner} />
          <div className="border border-line">
            <div className="hidden grid-cols-[minmax(0,1fr)_10rem_9rem_5rem_11rem] gap-4 border-b border-line bg-paper px-4 py-2 text-sm font-semibold text-ink-muted md:grid">
              <span className="pl-6">Compromiso</span><span>Responsable</span><span>Vence</span><span>Prioridad</span><span>Estado</span>
            </div>
            {visible.length ? (
              <ul>
                {visible.map((c) => (
                  <CommitmentRow key={c.id} commitment={c} today={today} onRequestStatus={requestStatus} message={messages[c.id]} />
                ))}
              </ul>
            ) : (
              <p className="bg-sheet px-4 py-8 text-base text-ink-muted">No hay compromisos en este filtro.</p>
            )}
          </div>
        </div>
      )}

      {pending && (
        <StatusDialog commitment={pending.commitment} to={pending.to} onConfirm={confirmPending} onClose={() => setPending(null)} />
      )}
    </main>
  );
}
