import { Button } from "../../components/ui";
import type { Brand, Category, ProductQuery } from "../../types";

type FilterKey = "q" | "categoryId" | "brandId" | "status" | "sort" | "dir";

const sortLabels: Record<string, string> = {
  name: "Ada göre",
  price: "Fiyata göre",
  stock: "Stoğa göre",
  updatedAt: "Son güncellenene göre",
};

export function ActiveFilters({
  filters,
  categories,
  brands,
  onRemove,
  onClear,
}: {
  filters: ProductQuery;
  categories: Category[];
  brands: Brand[];
  onRemove: (key: FilterKey) => void;
  onClear: () => void;
}) {
  const chips: Array<{ key: FilterKey; label: string }> = [];

  if (filters.q) chips.push({ key: "q", label: `Arama: ${filters.q}` });

  if (filters.categoryId)
    chips.push({
      key: "categoryId",
      label: `Kategori: ${categories.find((item) => item.id === filters.categoryId)?.name ?? filters.categoryId}`,
    });

  if (filters.brandId)
    chips.push({
      key: "brandId",
      label: `Marka: ${brands.find((item) => item.id === filters.brandId)?.name ?? filters.brandId}`,
    });

  if (filters.status)
    chips.push({
      key: "status",
      label: `Durum: ${{ 1: "Aktif", 2: "Pasif", 3: "Üretim durdu" }[filters.status]}`,
    });

  const hasCustomSort =
    (filters.sort ?? "updatedAt") !== "updatedAt" ||
    (filters.dir ?? "desc") !== "desc";

  if (hasCustomSort) {
    const isDateSort = (filters.sort ?? "updatedAt") === "updatedAt";

    chips.push({
      key: "sort",
      label: `Sıralama: ${sortLabels[filters.sort ?? "updatedAt"]}`,
    });

    chips.push({
      key: "dir",
      label: `Yön: ${
        isDateSort
          ? (filters.dir ?? "desc") === "asc"
            ? "En eski önce"
            : "En yeni önce"
          : (filters.dir ?? "desc") === "asc"
            ? "Artan"
            : "Azalan"
      }`,
    });
  }

  if (!chips.length) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold text-slate-500">
        Seçili filtreler:
      </span>

      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 rounded-full bg-brand-soft py-1 pl-3 pr-1 text-xs font-semibold text-brand"
        >
          <span>{chip.label}</span>
          <button
            className="grid h-5 w-5 place-items-center rounded-full text-brand hover:bg-blue-100"
            aria-label={`${chip.label} filtresini kaldır`}
            onClick={() => onRemove(chip.key)}
          >
            ×
          </button>
        </span>
      ))}

      <Button
        variant="ghost"
        className="px-2 py-1 text-xs text-danger hover:bg-danger-soft"
        onClick={onClear}
      >
        Tümünü temizle
      </Button>
    </div>
  );
}
