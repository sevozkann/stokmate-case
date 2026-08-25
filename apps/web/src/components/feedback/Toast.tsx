export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="fixed bottom-5 right-5 z-50 rounded-control bg-success px-4 py-3 text-sm font-bold text-white shadow-xl" role="status" aria-live="polite">✓ {message}</div>;
}
