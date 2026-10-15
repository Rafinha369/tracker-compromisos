import { useCallback, useEffect, useState } from "react";
import { changeCommitmentStatus, listCommitments } from "../services/commitments";
import { validateTransition } from "../lib/rules";

export function useCommitments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [error, setError] = useState(null);

  const apply = useCallback(({ data, error }) => {
    if (error) {
      setError(error);
      setStatus("error");
      return;
    }
    setItems(data);
    setError(null);
    setStatus("ready");
  }, []);

  useEffect(() => {
    let active = true;
    listCommitments().then((result) => active && apply(result));
    return () => {
      active = false;
    };
  }, [apply]);

  async function reload() {
    setStatus("loading");
    apply(await listCommitments());
  }

  // Devuelve el mensaje de error (o null) para que quien llama lo muestre donde corresponda.
  async function changeStatus(commitment, to, details = {}) {
    const invalid = validateTransition(commitment.status, to, details.evidence);
    if (invalid) return invalid;
    const { data, error } = await changeCommitmentStatus(commitment, to, details);
    if (error) return error.message;
    setItems((prev) => prev.map((c) => (c.id === data.id ? data : c)));
    return null;
  }

  return { items, status, error, reload, changeStatus };
}
