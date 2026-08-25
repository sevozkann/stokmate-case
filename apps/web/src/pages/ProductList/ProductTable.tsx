import type { Product } from "../../types";
import { ProductTableRow } from "./ProductTableRow";

export function ProductTable({
  products,
  total,
}: {
  products: Product[];
  total: number;
}) {
  return (
    <section className="overflow-hidden rounded-panel border border-line bg-white shadow-panel">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 text-sm">
        <strong>
          <span className="text-ink">{products.length}</span> / {total} ürün
          gösteriliyor
        </strong>
        <span className="hidden text-xs text-slate-500 sm:inline">
          Son güncelleme anlık olarak kontrol edilir
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[.08em] text-slate-500">
            <tr>
              <th className="px-5 py-3">Ürün</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Fiyat</th>
              <th className="px-5 py-3">Stok</th>
              <th className="px-5 py-3">Durum</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <ProductTableRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
