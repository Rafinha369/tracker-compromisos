export default function TextField({ label, id, hint, ...inputProps }) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1 text-sm font-semibold">
      {label}
      <input
        id={id}
        className="rounded border border-line bg-sheet px-3 py-2 text-base font-normal text-ink hover:border-ink-muted disabled:bg-paper disabled:text-ink-muted"
        {...inputProps}
      />
      {hint && <span className="font-normal text-ink-muted">{hint}</span>}
    </label>
  );
}
