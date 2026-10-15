import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { STATUS_LABEL, TRANSITIONS, daysBetween, isOverdue } from "../lib/rules";
import { formatShortDate } from "../lib/text";
import CommitmentDetail from "./CommitmentDetail";

const PRIORITY = { alta: "text-bad", media: "text-warn", baja: "text-ink-muted" };
const STATUS_STYLE = {
  completado: "border-ok text-ok",
  bloqueado: "border-bad text-bad",
  cancelado: "border-line text-ink-muted",
};

function dueText(c, today) {
  if (!c.due_date) return "Sin fecha";
  if (!["pendiente", "en_progreso", "bloqueado"].includes(c.status)) return formatShortDate(c.due_date);
  const d = daysBetween(today, c.due_date);
  if (d < 0) return `Vencido hace ${-d} ${d === -1 ? "día" : "días"}`;
  if (d === 0) return "Vence hoy";
  return `En ${d} ${d === 1 ? "día" : "días"}`;
}

export default function CommitmentRow({ commitment: c, today, onRequestStatus, message }) {
  const [open, setOpen] = useState(false);
  const overdue = isOverdue(c, today);
  const allowed = TRANSITIONS[c.status];

  return (
    <li className={`border-b border-line bg-sheet px-4 py-4 ${overdue ? "shadow-[inset_4px_0_0_#A3352E]" : ""}`}>
      <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_10rem_9rem_5rem_11rem] md:items-center md:gap-4">
        <button onClick={() => setOpen(!open)} aria-expanded={open}
          className="flex items-start gap-2 text-left text-base font-semibold hover:text-accent">
          <ChevronDown size={18} aria-hidden="true" className={`mt-1 shrink-0 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
          <span className={c.status === "cancelado" ? "text-ink-muted line-through" : ""}>{c.action}</span>
        </button>
        <span className="pl-6 text-sm md:pl-0 md:text-base">{c.owner_name}</span>
        <span className={`pl-6 text-sm md:pl-0 ${overdue ? "font-semibold text-bad" : "text-ink-muted"}`}>
          <span className="tabular-nums text-ink">{c.due_date ? formatShortDate(c.due_date) : ""}</span>
          {c.due_date && <br className="hidden md:block" />}
          {c.due_date ? <span className="md:hidden"> · </span> : null}
          {dueText(c, today)}
        </span>
        <span className={`pl-6 text-sm font-semibold capitalize md:pl-0 ${PRIORITY[c.priority]}`}>{c.priority}</span>
        <div className="pl-6 md:pl-0">
          <label className="sr-only" htmlFor={`status-${c.id}`}>Estado</label>
          <select id={`status-${c.id}`} value={c.status} disabled={!allowed.length}
            onChange={(e) => onRequestStatus(c, e.target.value)}
            className={`w-full rounded border bg-sheet px-2 py-1 text-sm font-semibold hover:border-ink disabled:opacity-80 ${STATUS_STYLE[c.status] ?? "border-line"}`}>
            <option value={c.status}>{STATUS_LABEL[c.status]}</option>
            {allowed.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
      </div>
      {message && <p className="mt-2 pl-6 text-sm text-bad" role="alert">{message}</p>}
      {open && <CommitmentDetail commitment={c} />}
    </li>
  );
}
