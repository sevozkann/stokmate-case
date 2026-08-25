import type { ProductStatus } from "../types";

const labels: Record<ProductStatus, string> = {
  1: "Aktif",
  2: "Pasif",
  3: "Üretim durdu",
};

const tones: Record<ProductStatus, string> = {
  1: "bg-success-soft text-success",
  2: "bg-slate-100 text-slate-600",
  3: "bg-orange-50 text-orange-700",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${tones[status]}`}
    >
      {labels[status]}
    </span>
  );
}
