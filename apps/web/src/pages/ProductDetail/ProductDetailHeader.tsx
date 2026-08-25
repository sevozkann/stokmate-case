import { Link, useLocation } from "react-router-dom";
import { StatusBadge } from "../../components/StatusBadge";
import type { Product } from "../../types";
import { currency, stockTone } from "../../utils";

export function ProductDetailHeader({ product, onBeforeBack }: { product: Product; onBeforeBack?: () => boolean }) {
  const location = useLocation();
  const listSearch =
    (location.state as { listSearch?: string } | null)?.listSearch ?? "";
  return (
    <>
      <Link
        className="mb-6 inline-block text-sm font-bold text-brand hover:text-brand-hover"
        to={{ pathname: "/products", search: listSearch }}
        onClick={(event) => { if (onBeforeBack && !onBeforeBack()) event.preventDefault(); }}
      >
        ← Ürünlere dön
      </Link>

      <header className="mb-5 grid gap-5 rounded-panel border border-line bg-white p-5 shadow-panel sm:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr_auto] lg:items-start">
        <img
          className="h-20 w-20 rounded-xl bg-slate-100 object-cover"
          src={product.imageUrl}
          alt=""
        />

        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-slate-500">
            {product.categoryName} · {product.brandName}
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {product.name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
            <span>{product.sku}</span>
            <StatusBadge status={product.status} />
            <strong className="text-lg text-ink">
              {currency(product.price)}
            </strong>
          </div>
        </div>

        <div
          className={`grid gap-1 rounded-control px-5 py-3 text-left lg:text-right ${stockTone(product.stock, product.minStock)}`}
        >
          <span className="text-[11px] font-medium text-slate-500">
            Mevcut stok
          </span>
          <strong className="text-2xl">{product.stock}</strong>
          <small className="text-[11px] font-normal text-slate-500">
            Minimum {product.minStock}
          </small>
        </div>
      </header>
    </>
  );
}
