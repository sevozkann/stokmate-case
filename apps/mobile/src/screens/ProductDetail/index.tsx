import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { api } from "../../lib/api/client";
import { Button, ConfirmModal, FormField, Input, Select } from "../../components/ui";
import { Toast } from "../../components/feedback";
import { ProductDetailHeader } from "./ProductDetailHeader";
import type {
  Brand,
  Category,
  Product,
  ProductInput,
  ProductStatus,
  Supplier,
} from "../../types";
import { fromMinorUnits, toMinorUnits } from "../../utils";

type Form = Omit<ProductInput, "price" | "costPrice"> & {
  price: string;
  costPrice: string;
};

const toForm = (p: Product): Form => ({
  ...p,
  price: fromMinorUnits(p.price),
  costPrice: fromMinorUnits(p.costPrice),
});

export function ProductDetailScreen({
  product,
  onBack,
  onUpdated,
}: {
  product: Product;
  onBack: () => void;
  onUpdated: (p: Product) => void;
}) {
  const [form, setForm] = useState<Form>(() => toForm(product));
  const [leave, setLeave] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    variant: "success" | "error";
  } | null>(null);

  useEffect(() => {
    void Promise.all([api.categories(), api.brands(), api.suppliers()])
      .then(([c, b, s]) => {
        setCategories(c);
        setBrands(b);
        setSuppliers(s);
      })
      .catch(() =>
        setToast({
          message: "Kategori seçenekleri yüklenemedi.",
          variant: "error",
        }),
      );
  }, []);

  const dirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(toForm(product)),
    [form, product],
  );

  useEffect(() => {
    if (dirty) return;
    const refreshProduct = async () => {
      try {
        const data = await api.products({ page: 1, pageSize: 100 });
        const next = data.items.find((item) => item.id === product.id);
        if (next) {
          onUpdated(next);
          setForm(toForm(next));
        }
      } catch {
        // Background refresh should not disrupt field staff while editing.
      }
    };
    const interval = setInterval(() => void refreshProduct(), 8_000);
    return () => clearInterval(interval);
  }, [dirty, onUpdated, product]);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 3_500);
    return () => clearTimeout(timeout);
  }, [toast]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((old) => ({ ...old, [key]: value }));

  const save = async () => {
    const stock = Number(form.stock);
    const minStock = Number(form.minStock);
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
              : !Number.isInteger(stock) || stock < 0
                ? "Stok adedi sıfır veya daha büyük bir tam sayı olmalı."
                : !Number.isInteger(minStock) || minStock < 0
                  ? "Minimum stok sıfır veya daha büyük bir tam sayı olmalı."
                  : !form.categoryId || !form.brandId || !form.supplierId
                    ? "Kategori, marka ve tedarikçi seçin."
                    : "";

    if (invalidMessage) {
      setToast({ message: invalidMessage, variant: "error" });
      return;
    }

    setSaving(true);

    try {
      const result = await api.updateProduct(product.id, {
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim(),
        stock,
        minStock,
        price,
        costPrice,
      });
      onUpdated(result);
      setForm(toForm(result));
      setToast({ message: "Ürün bilgileri güncellendi.", variant: "success" });
    } catch (e) {
      setToast({
        message: e instanceof Error ? e.message : "Güncelleme yapılamadı.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={s.page}>
      <ScrollView contentContainerStyle={s.content}>
      <ProductDetailHeader
        product={product}
        onBack={() => (dirty ? setLeave(true) : onBack())}
      />

      <View style={s.card}>
        <Text style={s.title}>Ürün bilgileri</Text>
        <Text style={s.copy}>
          Yaptığınız değişiklikler web ve mobil uygulamada görünür.
        </Text>

        <FormField label="Ürün adı"><Input value={form.name} onChangeText={(value) => set("name", value)} /></FormField>
        <FormField label="Stok kodu"><Input value={form.sku} onChangeText={(value) => set("sku", value)} /></FormField>
        <FormField label="Satış fiyatı (₺)"><Input value={form.price} onChangeText={(value) => set("price", value)} keyboardType="decimal-pad" /></FormField>
        <Select
          label="Kategori"
          value={form.categoryId}
          items={categories}
          onChange={(value) => set("categoryId", value)}
        />
        <Select
          label="Marka"
          value={form.brandId}
          items={brands}
          onChange={(value) => set("brandId", value)}
        />
        <Select
          label="Tedarikçi"
          value={form.supplierId}
          items={suppliers}
          onChange={(value) => set("supplierId", value)}
        />
        <FormField label="Stok adedi">
          <View style={s.stepper}>
            <Pressable onPress={() => set("stock", Math.max(0, Number(form.stock || 0) - 1))}>
              <Text style={s.control}>−</Text>
            </Pressable>
            <Input style={s.stockInput} value={String(form.stock)} onChangeText={(v) => set("stock", Number(v))} keyboardType="number-pad" />
            <Pressable onPress={() => set("stock", Number(form.stock || 0) + 1)}>
              <Text style={s.control}>+</Text>
            </Pressable>
          </View>
        </FormField>

        <Select
          label="Durum"
          value={form.status}
          items={[
            { id: 1, name: "Aktif" },
            { id: 2, name: "Pasif" },
            { id: 3, name: "Üretim durdu" },
          ]}
          onChange={(value) => set("status", value as ProductStatus)}
        />

        <Pressable
          style={s.detailsToggle}
          onPress={() => setDetailsOpen((value) => !value)}
          accessibilityRole="button"
          accessibilityState={{ expanded: detailsOpen }}
        >
          <Ionicons
            name={detailsOpen ? "chevron-down" : "chevron-forward"}
            size={18}
            color="#367dea"
          />
          <Text style={s.detailsText}>Diğer alanlar</Text>
        </Pressable>
        {detailsOpen && (
          <>
            <FormField label="Alış maliyeti (₺)"><Input value={form.costPrice} onChangeText={(value) => set("costPrice", value)} keyboardType="decimal-pad" /></FormField>
            <FormField label="Minimum stok"><Input value={String(form.minStock)} onChangeText={(value) => set("minStock", Number(value))} keyboardType="number-pad" /></FormField>
            <FormField label="Barkod"><Input value={form.barcode} onChangeText={(value) => set("barcode", value)} /></FormField>
          </>
        )}
        <View style={s.footer}>
          <Button variant="secondary" style={s.cancel} onPress={() => setForm(toForm(product))}>Vazgeç</Button>
          <Button style={s.save} loading={saving} onPress={() => void save()}>Değişiklikleri kaydet</Button>
        </View>
      </View>

      </ScrollView>

      <ConfirmModal
        visible={leave}
        onCancel={() => setLeave(false)}
        onConfirm={onBack}
      />
      <Toast message={toast?.message} variant={toast?.variant} />
    </View>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: "#f5f7fb", flex: 1 },
  content: { padding: 20 },
  back: { color: "#367dea", fontWeight: "800", marginTop: 12 },
  title: { color: "#17243a", fontSize: 25, fontWeight: "800" },
  copy: { color: "#718098", fontSize: 13, marginTop: 7, marginBottom: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginTop: 22,
    padding: 14,
  },
  detailsToggle: {
    alignItems: "center",
    borderTopColor: "#edf1f6",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
    paddingTop: 18,
  },
  detailsText: { color: "#367dea", fontWeight: "800" },
  stepper: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  control: { color: "#367dea", fontSize: 30, padding: 14 },
  stockInput: {
    fontSize: 22,
    textAlign: "center",
    width: 100,
  },
  footer: { flexDirection: "row", gap: 10, marginTop: 22 },
  cancel: { paddingHorizontal: 15 },
  save: { flex: 1 },
});
