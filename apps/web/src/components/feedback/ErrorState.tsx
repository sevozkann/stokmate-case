export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="grid min-h-72 place-content-center justify-items-center gap-2 text-center text-sm text-danger"
      role="alert"
    >
      <strong className="text-ink">Bir sorun oluştu</strong>
      <span>{message}</span>
      {onRetry && (
        <button
          className="mt-2 rounded-control border border-line bg-white px-3 py-2 text-ink hover:bg-slate-50"
          onClick={onRetry}
        >
          Tekrar dene
        </button>
      )}
    </div>
  );
}
