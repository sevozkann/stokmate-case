export function EmptyState() {
  return (
    <div className="grid min-h-72 place-content-center justify-items-center gap-2 text-center text-sm text-muted">
      <strong className="text-ink">Sonuç bulunamadı</strong>
      <span>Arama veya filtreleri değiştirerek tekrar deneyin.</span>
    </div>
  );
}
