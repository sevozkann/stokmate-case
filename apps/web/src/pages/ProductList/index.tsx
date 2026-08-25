import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  EmptyState,
  ErrorState,
  ProductTableSkeleton,
} from "../../components/feedback";
import { api } from "../../lib/api/client";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import type {
  Brand,
  Category,
  PagedResult,
  Product,
  ProductQuery,
} from "../../types";
import { Pagination } from "./Pagination";
import { ActiveFilters } from "./ActiveFilters";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";

const PAGE_SIZE = 12;
const asNumber = (value: string | null) => (value ? Number(value) : undefined);

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ProductQuery>(() => ({
    page: asNumber(searchParams.get("page")) ?? 1,
    pageSize: PAGE_SIZE,
    sort: searchParams.get("sort") ?? "updatedAt",
    dir: (searchParams.get("dir") as "asc" | "desc" | null) ?? "desc",
    q: searchParams.get("q") ?? undefined,
    categoryId: asNumber(searchParams.get("categoryId")),
    brandId: asNumber(searchParams.get("brandId")),
    status: asNumber(searchParams.get("status")) as ProductQuery["status"],
  }));

  const [data, setData] = useState<PagedResult<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);
  const debouncedQuery = useDebouncedValue(filters.q ?? "", 300);

  const requestFilters = useMemo<ProductQuery>(
    () => ({
      page: filters.page,
      pageSize: filters.pageSize,
      sort: filters.sort,
      dir: filters.dir,
      categoryId: filters.categoryId,
      brandId: filters.brandId,
      status: filters.status,
      q: debouncedQuery || undefined,
    }),
    [
      debouncedQuery,
      filters.brandId,
      filters.categoryId,
      filters.dir,
      filters.page,
      filters.pageSize,
      filters.sort,
      filters.status,
    ],
  );

  const load = useCallback(async (signal?: AbortSignal) => {
    const currentRequestId = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const products = await api.products(requestFilters, signal);
      if (signal?.aborted || currentRequestId !== requestId.current) return;
      setData(products);
    } catch (err) {
      if (signal?.aborted || currentRequestId !== requestId.current) return;
      setError(err instanceof Error ? err.message : "Ürünler yüklenemedi.");
    } finally {
      if (!signal?.aborted && currentRequestId === requestId.current)
        setLoading(false);
    }
  }, [requestFilters]);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    let isCurrent = true;
    void Promise.all([api.categories(), api.brands()]).then(([cats, brandList]) => {
      if (!isCurrent) return;
      setCategories(cats);
      setBrands(brandList);
    });
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.q) next.set("q", filters.q);
    if (filters.categoryId) next.set("categoryId", String(filters.categoryId));
    if (filters.brandId) next.set("brandId", String(filters.brandId));
    if (filters.status) next.set("status", String(filters.status));
    if (filters.page > 1) next.set("page", String(filters.page));
    if (filters.sort && filters.sort !== "updatedAt") next.set("sort", filters.sort);
    if (filters.dir && filters.dir !== "desc") next.set("dir", filters.dir);
    setSearchParams(next, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    const id = window.setInterval(() => void load(), 8_000);
    return () => window.clearInterval(id);
  }, [load]);

  const pages = useMemo(
    () => Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE)),
    [data],
  );

  function change(name: keyof ProductQuery, value: string) {
    setFilters((old) => ({
      ...old,
      [name]:
        value === ""
          ? undefined
          : name === "q" || name === "sort" || name === "dir"
            ? value
            : Number(value),
      page: 1,
    }));
  }

  function clearFilter(
    name: "q" | "categoryId" | "brandId" | "status" | "sort" | "dir",
  ) {
    setFilters((old) => ({
      ...old,
      [name]: name === "sort" ? "updatedAt" : name === "dir" ? "desc" : undefined,
      page: 1,
    }));
  }

  function clearAllFilters() {
    setFilters((old) => ({
      ...old,
      q: undefined,
      categoryId: undefined,
      brandId: undefined,
      status: undefined,
      sort: "updatedAt",
      dir: "desc",
      page: 1,
    }));
  }

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-10 lg:px-[clamp(24px,5vw,72px)] lg:py-12">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[.12em] text-slate-500">
            Katalog
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Ürünler
          </h1>
          <p className="mt-2 text-sm text-muted">
            Fiyat, stok ve ürün bilgilerini yönetin.
          </p>
        </div>
        <span className="w-fit rounded-full bg-success-soft px-3 py-2 text-xs font-medium text-success">
          Otomatik yenileme açık
        </span>
      </header>

      <ProductFilters
        filters={filters}
        categories={categories}
        brands={brands}
        onChange={change}
      />

      <ActiveFilters
        filters={filters}
        categories={categories}
        brands={brands}
        onRemove={clearFilter}
        onClear={clearAllFilters}
      />

      {loading && !data ? (
        <ProductTableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : !data?.items.length ? (
        <EmptyState />
      ) : (
        <>
          <ProductTable products={data.items} total={data.total} />

          <Pagination
            page={filters.page}
            pages={pages}
            disabled={loading}
            onPageChange={(page) => setFilters((old) => ({ ...old, page }))}
          />
        </>
      )}
    </div>
  );
}
