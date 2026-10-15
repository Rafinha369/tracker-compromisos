export default function FullScreenMessage({ title, children, tone = "neutral" }) {
  const border = tone === "error" ? "border-bad" : "border-line";
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className={`max-w-lg bg-sheet border-l-4 ${border} px-6 py-8`} role={tone === "error" ? "alert" : "status"}>
        <h1 className="font-display font-bold text-lg">{title}</h1>
        <div className="mt-2 text-base text-ink-muted">{children}</div>
      </div>
    </main>
  );
}
