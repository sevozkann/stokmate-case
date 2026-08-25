import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api/client";
import { ErrorState, LoadingState, Toast } from "../../components/feedback";
import {
  Button,
  ConfirmModal,
  FormField,
  Input,
  Select,
} from "../../components/ui";
import { ProductDetailHeader } from "./ProductDetailHeader";
import type {
  Brand,
  Category,
  Product,
  ProductInput,
  Supplier,
} from "../../types";
import { fromMinorUnits, toMinorUnits } from "../../utils";

type FormState = Omit<ProductInput, "price" | "costPrice"> & {
  price: string;
  costPrice: string;
};

const toForm = (p: Product): FormState => ({
  name: p.name,
  sku: p.sku,
  barcode: p.barcode,
  categoryId: p.categoryId,
  brandId: p.brandId,
  supplierId: p.supplierId,
  price: fromMinorUnits(p.price),
  costPrice: fromMinorUnits(p.costPrice),
  stock: p.stock,
  minStock: p.minStock,
  unit: p.unit,
  status: p.status,
  description: p.description,
  isFeatured: p.isFeatured,
});

export function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state?.product as Product | undefined;

  const [product, setProduct] = useState<Product | null>(initial ?? null),
    [form, setForm] = useState<FormState | null>(
      initial ? toForm(initial) : null,
    ),
    [categories, setCategories] = useState<Category[]>([]),
    [brands, setBrands] = useState<Brand[]>([]),
    [suppliers, setSuppliers] = useState<Supplier[]>([]),
    [loading, setLoading] = useState(!initial),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [notice, setNotice] = useState(""),
    [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    Promise.all([
      api.categories(),
      api.brands(),
      api.suppliers(),
      initial
        ? Promise.resolve(null)
        : api.products({ page: 1, pageSize: 100 }),
    ])
      .then(([cats, brandList, supplierList, list]) => {
        setCategories(cats);
        setBrands(brandList);
        setSuppliers(supplierList);
        const found =
          initial ?? list?.items.find((item) => item.id === Number(id));
        if (!found) throw new Error("Ürün bulunamadı.");
        setProduct(found);
        setForm(toForm(found));
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Ürün yüklenemedi."),
      )
      .finally(() => setLoading(false));
  }, [id, initial]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((old) => (old ? { ...old, [key]: value } : old));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form || !product) return;
    setError("");
    setNotice("");
    const price = toMinorUnits(form.price);
    const costPrice = toMinorUnits(form.costPrice);
    const invalidMessage =
      !form.name.trim()
        ? "Ürün adı zorunludur."
        : !form.sku.trim()
          ? "Stok kodu zorunludur."
          : !form.price.trim() || !Number.isFinite(price) || price < 0
            ? "Geçerli bir satış fiyatı girin."
            : !form.costPrice.trim() || !Number.isFinite(costPrice) || costPrice < 0
              ? "Geçerli bir alış maliyeti girin."
              : !Number.isInteger(form.stock) || form.stock < 0
                ? "Stok adedi sıfır veya daha büyük bir tam sayı olmalı."
                : !Number.isInteger(form.minStock) || form.minStock < 0
                  ? "Minimum stok sıfır veya daha büyük bir tam sayı olmalı."
                  : !form.categoryId || !form.brandId || !form.supplierId
                    ? "Kategori, marka ve tedarikçi seçin."
                    : "";
    if (invalidMessage) {
      setError(invalidMessage);
      return;
    }

    setSaving(true);
    try {
      const result = await api.updateProduct(product.id, {
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim(),
        price,
        costPrice,
      });
      setProduct(result);
      setForm(toForm(result));
      setNotice("Değişiklikler kaydedildi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ürün güncellenemedi.");
    } finally {
      setSaving(false);
    }
  }

  const isDirty = useMemo(
    () =>
      Boolean(
        product &&
        form &&
        JSON.stringify(form) !== JSON.stringify(toForm(product)),
      ),
    [form, product],
  );
  useEffect(() => {
    if (!isDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (isDirty || !product) return;
    const refreshProduct = async () => {
      try {
        const data = await api.products({ page: 1, pageSize: 100 });
        const next = data.items.find((item) => item.id === product.id);
        if (next) {
          setProduct(next);
          setForm(toForm(next));
        }
      } catch {
        // Background refresh must not interrupt the user's current view.
      }
    };
    const interval = window.setInterval(() => void refreshProduct(), 8_000);
    return () => window.clearInterval(interval);
  }, [isDirty, product]);

  if (loading) return <LoadingState label="Ürün yükleniyor…" />;

  if (error && !product)
    return <ErrorState message={error} onRetry={() => navigate(0)} />;

  if (!product || !form) return null;
  const listSearch =
    (location.state as { listSearch?: string } | null)?.listSearch ?? "";
  const field = (label: string, element: React.ReactNode) => (
    <FormField label={label}>{element}</FormField>
  );
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-10 lg:px-[clamp(24px,5vw,72px)] lg:py-12">
      <ProductDetailHeader
        product={product}
        onBeforeBack={() => {
          if (!isDirty) return true;
          setShowLeaveModal(true);
          return false;
        }}
      />

      <form
        className="rounded-panel border border-line bg-white p-6 shadow-panel"
        onSubmit={submit}
      >
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-ink">
              Ürün bilgileri
            </h2>
            <p className="mt-1 text-sm text-muted">
              Yaptığınız değişiklikler web ve mobil uygulamada görünür.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-control border border-red-200 bg-danger-soft px-3 py-2.5 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {field(
            "Ürün adı",
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />,
          )}

          {field(
            "Stok kodu",
            <Input
              value={form.sku}
              onChange={(e) => set("sku", e.target.value)}
              required
            />,
          )}

          {field(
            "Satış fiyatı (₺)",
            <Input
              inputMode="decimal"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
            />,
          )}

          {field(
            "Stok adedi",
            <Input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
              required
            />,
          )}

          {field(
            "Durum",
            <Select
              value={form.status}
              onChange={(e) =>
                set("status", Number(e.target.value) as 1 | 2 | 3)
              }
            >
              <option value="1">Aktif</option>
              <option value="2">Pasif</option>
              <option value="3">Üretim durdu</option>
            </Select>,
          )}

          {field(
            "Kategori",
            <Select
              value={form.categoryId}
              onChange={(e) => set("categoryId", Number(e.target.value))}
            >
              {categories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>,
          )}

          {field(
            "Marka",
            <Select
              value={form.brandId}
              onChange={(e) => set("brandId", Number(e.target.value))}
            >
              {brands.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>,
          )}

          {field(
            "Tedarikçi",
            <Select
              value={form.supplierId}
              onChange={(e) => set("supplierId", Number(e.target.value))}
            >
              {suppliers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>,
          )}
        </div>

        <details className="mt-6 border-t border-slate-100 pt-5">
          <summary className="cursor-pointer text-sm font-bold text-brand">
            Diğer alanlar
          </summary>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {field(
              "Alış maliyeti (₺)",
              <Input
                inputMode="decimal"
                value={form.costPrice}
                onChange={(e) => set("costPrice", e.target.value)}
                required
              />,
            )}

            {field(
              "Minimum stok",
              <Input
                type="number"
                min="0"
                value={form.minStock}
                onChange={(e) => set("minStock", Number(e.target.value))}
                required
              />,
            )}

            {field(
              "Barkod",
              <Input
                value={form.barcode}
                onChange={(e) => set("barcode", e.target.value)}
              />,
            )}
          </div>
        </details>

        <footer className="mt-7 flex justify-end gap-2 border-t border-slate-100 pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setForm(toForm(product));
              setNotice("");
            }}
          >
            Vazgeç
          </Button>

          <Button disabled={saving}>
            {saving ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
          </Button>
        </footer>
      </form>

      <Toast message={notice} />
      <ConfirmModal
        open={showLeaveModal}
        title="Kaydedilmemiş değişiklikler var"
        description="Bu sayfadan ayrılırsanız yaptığınız değişiklikler kaybolacak."
        cancelLabel="Sayfada kal"
        confirmLabel="Ayrıl"
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={() =>
          navigate({ pathname: "/products", search: listSearch })
        }
      />
    </div>
  );
}
