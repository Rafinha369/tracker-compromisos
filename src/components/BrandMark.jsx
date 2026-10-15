export default function BrandMark({ dark = false }) {
  return (
    <span className={`flex items-center gap-2 font-display font-extrabold text-lg ${dark ? "text-ink" : "text-sheet"}`}>
      <span className="inline-block h-2 w-5 -skew-x-12 bg-marker" aria-hidden="true" />
      Compromisos
    </span>
  );
}
