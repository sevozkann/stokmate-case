import { Input, Select } from "../../components/ui";
import type { Brand, Category, ProductQuery } from "../../types";

export function ProductFilters({
  filters,
  categories,
  brands,
  onChange,
}: {
  filters: ProductQuery;
  categories: Category[];
  brands: Brand[];
  onChange: (name: keyof ProductQuery, value: string) => void;
}) {
  const isDateSort = (filters.sort ?? "updatedAt") === "updatedAt";

  return (
    <section className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.6fr)_repeat(5,minmax(135px,.7fr))]">
      <label className="relative sm:col-span-2 xl:col-span-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" strokeLinecap="round" />
          </svg>
        </span>
        <Input
          className="pl-9"
          value={filters.q ?? ""}
          placeholder="Ürün adı veya stok kodu ara"
          aria-label="Ürün ara"
          onChange={(e) => onChange("q", e.target.value)}
        />
      </label>

      <Select
        value={filters.categoryId ?? ""}
        onChange={(e) => onChange("categoryId", e.target.value)}
        aria-label="Kategori filtresi"
      >
        <option value="">Tüm kategoriler</option>
        {categories.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>

      <Select
        value={filters.brandId ?? ""}
        onChange={(e) => onChange("brandId", e.target.value)}
        aria-label="Marka filtresi"
      >
        <option value="">Tüm markalar</option>
        {brands.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </Select>

      <Select
        value={filters.status ?? ""}
        onChange={(e) => onChange("status", e.target.value)}
        aria-label="Durum filtresi"
      >
        <option value="">Tüm durumlar</option>
        <option value="1">Aktif</option>
        <option value="2">Pasif</option>
        <option value="3">Üretim durdu</option>
      </Select>

      <Select
        value={filters.sort ?? "updatedAt"}
        onChange={(e) => onChange("sort", e.target.value)}
        aria-label="Sıralama alanı"
      >
        <option value="name">Ada göre</option>
        <option value="price">Fiyata göre</option>
        <option value="stock">Stoğa göre</option>
        <option value="updatedAt">Son güncellenene göre</option>
      </Select>

      <Select
        value={filters.dir ?? "desc"}
        onChange={(e) => onChange("dir", e.target.value)}
        aria-label="Sıralama yönü"
      >
        <option value="asc">{isDateSort ? "En eski önce" : "Artan"}</option>
        <option value="desc">{isDateSort ? "En yeni önce" : "Azalan"}</option>
      </Select>
    </section>
  );
}
