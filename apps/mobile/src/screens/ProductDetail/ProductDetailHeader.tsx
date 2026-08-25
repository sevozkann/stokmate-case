import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Product } from "../../types";
import { money, stockState } from "../../utils";
export function ProductDetailHeader({
  product,
  onBack,
}: {
  product: Product;
  onBack: () => void;
}) {
  const state = stockState(product.stock, product.minStock);
  const status = { 1: "Aktif", 2: "Pasif", 3: "Üretim durdu" }[product.status];
  return (
    <>
      <Pressable onPress={onBack}>
        <Text style={s.back}>‹ Ürünlere dön</Text>
      </Pressable>

      <View style={s.card}>
        <Image source={{ uri: product.imageUrl }} style={s.image} />
        <View style={s.main}>
          <Text style={s.overline}>
            {product.categoryName} · {product.brandName}
          </Text>
          <Text style={s.name}>{product.name}</Text>
          <View style={s.metaRow}>
            <Text style={s.meta}>{product.sku}</Text>

            <Text
              style={[s.badge, product.status === 1 ? s.active : s.inactive]}
            >
              {status}
            </Text>

            <Text style={s.money}>{money(product.price)}</Text>
          </View>
        </View>

        <View
          style={[
            s.stockBox,
            state === "Tükendi"
              ? s.danger
              : state === "Kritik"
                ? s.warning
                : s.good,
          ]}
        >
          <Text style={s.stockLabel}>Mevcut stok</Text>
          <Text style={s.stock}>{product.stock}</Text>
          <Text style={s.min}>Minimum {product.minStock}</Text>
        </View>
      </View>
    </>
  );
}
const s = StyleSheet.create({
  back: { color: "#367dea", fontWeight: "800", marginTop: 12 },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    marginTop: 18,
    padding: 14,
  },
  image: {
    backgroundColor: "#e9eef4",
    borderRadius: 12,
    height: 62,
    width: 62,
  },
  main: { flex: 1, marginLeft: 11 },
  overline: { color: "#718098", fontSize: 10, fontWeight: "800" },
  name: { color: "#17243a", fontSize: 16, fontWeight: "800", marginTop: 3 },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  meta: { color: "#718098", fontSize: 12 },
  money: { color: "#172033", fontSize: 12, fontWeight: 600 },
  badge: {
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  active: { backgroundColor: "#e3f6ee", color: "#28775e" },
  inactive: { backgroundColor: "#fff2d8", color: "#9a6200" },
  stockBox: {
    alignItems: "flex-end",
    borderRadius: 10,
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  good: { backgroundColor: "#e3f6ee" },
  warning: { backgroundColor: "#fff2d8" },
  danger: { backgroundColor: "#fff0ee" },
  stock: { color: "#ad7418", fontSize: 19, fontWeight: "800" },
  stockLabel: { color: "#718098", fontSize: 9 },
  min: { color: "#718098", fontSize: 9, fontWeight: "600" },
});
