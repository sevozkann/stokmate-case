import { Link, useLocation } from "react-router-dom";
import { StatusBadge } from "../../components/StatusBadge";
import type { Product } from "../../types";
import { currency, stockTone } from "../../utils";

export function ProductTableRow({ product }: { product: Product }) {
  const location = useLocation();
  const destination = `/products/${product.id}`;
  const state = { product, listSearch: location.search };

  return (
    <tr className="border-t border-slate-100 text-sm text-slate-600">
      <td className="px-5 py-3">
        <Link
          className="flex min-w-[220px] items-center gap-3 text-ink"
          to={destination}
          state={state}
        >
          <img
            className="h-10 w-10 rounded-lg bg-slate-100 object-cover"
            src={product.imageUrl}
            alt=""
          />
          <span className="grid gap-1">
            <strong>{product.name}</strong>
            <small className="text-[11px] font-normal text-slate-400">
              {product.sku} · {product.brandName}
            </small>
          </span>
        </Link>
      </td>

      <td className="px-5 py-3">{product.categoryName}</td>

      <td className="px-5 py-3 font-bold text-ink">
        {currency(product.price)}
      </td>

      <td className="px-5 py-3">
        <span
          className={`rounded-lg px-2 py-1 text-xs font-bold ${stockTone(product.stock, product.minStock)}`}
        >
          {product.stock}{" "}
          <small className="font-normal text-slate-500">
            / min. {product.minStock}
          </small>
        </span>
      </td>

      <td className="px-5 py-3">
        <StatusBadge status={product.status} />
      </td>

      <td className="px-5 py-3">
        <Link
          className="rounded-lg bg-brand-soft px-2 py-1 text-base text-brand hover:bg-blue-100"
          to={destination}
          state={state}
          aria-label={`${product.name} detay`}
        >
          →
        </Link>
      </td>
    </tr>
  );
}
