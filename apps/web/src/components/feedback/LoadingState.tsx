export function LoadingState({ label = "Yükleniyor…" }: { label?: string }) {
  return (
    <div className="grid min-h-72 place-content-center justify-items-center gap-2 text-center text-sm text-muted">
      <i className="h-6 w-6 animate-spin rounded-full border-[3px] border-brand-soft border-t-brand" />
      {label}
    </div>
  );
}
