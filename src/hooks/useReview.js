import { useState } from "react";
import { extractCommitments } from "../services/extraction";
import { createCommitment, listActiveCommitments } from "../services/commitments";
import { findDuplicate, reviewItems, validateForApproval } from "../lib/rules";

// decision: "abierto" | "aprobado" | "descartado"
const withUiState = (item) => ({ ...item, decision: "abierto", message: null, canForce: false, saving: false });

function emptyManualRow() {
  return withUiState({
    tempId: `m${Date.now()}`, kind: "compromiso", manual: true, action: "", owner: null, dueDate: null,
    dueDateText: null, dependency: null, priority: "media", sourceSentence: "", confidence: 1,
    needsClarification: false, clarificationReason: null, route: "revision",
    checks: { sourceFound: false }, flags: ["Creado a mano: completa los campos"],
  });
}

export function useReview() {
  const [rows, setRows] = useState(null);
  const [existing, setExisting] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);
  const [meta, setMeta] = useState(null);

  async function extract({ notes, title, meetingDate }) {
    setStatus("loading");
    setError(null);
    setWarning(null);
    const [extraction, current] = await Promise.all([
      extractCommitments({ notes, title, meetingDate }),
      listActiveCommitments(),
    ]);
    if (current.error) setWarning(`${current.error.message}. No se revisarán duplicados contra el tracker.`);
    setExisting(current.data);
    if (extraction.error) {
      setError(extraction.error);
      setStatus("error");
      return;
    }
    const reviewed = reviewItems(extraction.data.items, notes, meetingDate, current.data);
    setRows(reviewed.map(withUiState));
    setMeta({ ms: extraction.data.ms, model: extraction.data.model });
    setStatus("done");
  }

  function update(tempId, patch) {
    setRows((prev) => prev?.map((r) => (r.tempId === tempId ? { ...r, ...patch } : r)) ?? prev);
  }

  async function approve(row, sourceTitle, force = false) {
    const invalid = validateForApproval(row);
    if (invalid) return update(row.tempId, { message: invalid });
    if (!force) {
      const pool = existing.map((c) => ({ id: c.id, action: c.action, owner: c.owner_name }));
      const dup = findDuplicate(row, pool);
      if (dup) return update(row.tempId, { message: `Ya tienes un compromiso parecido: "${dup.action}".`, canForce: true });
    }
    update(row.tempId, { saving: true, message: null });
    const { data, error } = await createCommitment(row, sourceTitle);
    if (error) return update(row.tempId, { saving: false, message: error.message });
    setExisting((prev) => [...prev, data]);
    update(row.tempId, { saving: false, decision: "aprobado", canForce: false });
  }

  async function approveReady(sourceTitle) {
    for (const row of rows?.filter((r) => r.route === "listo" && r.decision === "abierto") ?? []) {
      await approve(row, sourceTitle);
    }
  }

  function addManual() {
    setRows((prev) => [emptyManualRow(), ...(prev ?? [])]);
    setStatus("done");
  }

  function reset() {
    setRows(null);
    setStatus("idle");
    setError(null);
    setMeta(null);
  }

  return { rows, status, error, warning, meta, extract, update, approve, approveReady, addManual, reset };
}
