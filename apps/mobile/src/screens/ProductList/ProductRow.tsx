import {
  Image,
  ImageStyle,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { Product } from "../../types";
import { money, stockState } from "../../utils";

const statusMeta = {
  1: { label: "Aktif", style: "active" },
  2: { label: "Pasif", style: "passive" },
  3: { label: "Üretim durdu", style: "stopped" },
} as const;

export function ProductRow({
  product,
  onPress,
}: {
  product: Product;
  onPress: () => void;
}) {
  const state = stockState(product.stock, product.minStock);
  const tone =
    state === "Tükendi"
      ? styles.bad
      : state === "Kritik"
        ? styles.warn
        : styles.good;
  const textTone =
    state === "Tükendi"
      ? styles.badText
      : state === "Kritik"
        ? styles.warnText
        : styles.goodText;
  const status = statusMeta[product.status];
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image as ImageStyle}
      />

      <View style={styles.main}>
        <Text numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {product.sku} · {product.brandName} · {product.categoryName}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{money(product.price)}</Text>
          <Text style={[styles.status, styles[status.style]]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={[styles.pill, tone]}>
        <Text style={[styles.stock, textTone]}>{product.stock}</Text>
        <Text style={styles.label}>/ min. {product.minStock}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    elevation: 1,
    flexDirection: "row",
    marginBottom: 9,
    padding: 12,
  },
  image: {
    backgroundColor: "#e9eef4",
    borderRadius: 11,
    height: 51,
    width: 51,
  },
  main: { flex: 1, marginLeft: 11 },
  name: { color: "#1c2b43", fontSize: 14, fontWeight: "700" },
  meta: { color: "#77869a", fontSize: 11, marginTop: 3 },
  priceRow: { alignItems: "center", flexDirection: "row", gap: 7, marginTop: 5 },
  price: { color: "#172033", fontSize: 13, fontWeight: "800" },
  status: { borderRadius: 99, fontSize: 10, fontWeight: "800", paddingHorizontal: 7, paddingVertical: 3 },
  active: { backgroundColor: "#e3f6ef", color: "#277662" },
  passive: { backgroundColor: "#f1f5f9", color: "#475569" },
  stopped: { backgroundColor: "#fff7ed", color: "#c2410c" },
  pill: {
    alignItems: "center",
    borderRadius: 9,
    flexDirection: "row",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 7,
  },
  good: { backgroundColor: "#e3f6ee" },
  warn: { backgroundColor: "#fff2d8" },
  bad: { backgroundColor: "#fff0ee" },
  goodText: { color: "#277662" },
  warnText: { color: "#ad7418" },
  badText: { color: "#c74a4a" },
  stock: { fontSize: 13, fontWeight: "800" },
  label: { color: "#64748b", fontSize: 11 },
});
