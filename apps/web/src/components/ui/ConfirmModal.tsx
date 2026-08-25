import { useEffect } from "react";
import { Button } from "./Button";

export function ConfirmModal({
  open,
  title,
  description,
  cancelLabel = "Vazgeç",
  confirmLabel = "Devam et",
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-md rounded-panel bg-white p-6 shadow-2xl">
        <h2 id="confirm-modal-title" className="text-xl font-extrabold text-ink">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} autoFocus>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}
