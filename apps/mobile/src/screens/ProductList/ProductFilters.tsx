import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Brand, Category, ProductQuery, ProductStatus } from "../../types";

type FilterState = Pick<
  ProductQuery,
  "categoryId" | "brandId" | "status" | "sort" | "dir"
>;

const sortOptions: Array<{
  value: NonNullable<ProductQuery["sort"]>;
  label: string;
}> = [
  { value: "updatedAt", label: "Son güncellenen" },
  { value: "name", label: "Ürün adı" },
  { value: "price", label: "Fiyat" },
  { value: "stock", label: "Stok" },
];

export function FilterSheet({
  visible,
  filters,
  categories,
  brands,
  onApply,
  onClose,
}: {
  visible: boolean;
  filters: FilterState;
  categories: Category[];
  brands: Brand[];
  onApply: (filters: FilterState) => void;
  onClose: () => void;
}) {
  const [draftFilters, setDraftFilters] = useState(filters);

  useEffect(() => {
    if (visible) setDraftFilters(filters);
  }, [filters, visible]);

  const change = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K],
  ) => setDraftFilters((current) => ({ ...current, [key]: value }));
  const clearDraft = () => setDraftFilters({ sort: "updatedAt", dir: "desc" });
  const isDateSort = (draftFilters.sort ?? "updatedAt") === "updatedAt";

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Filtrele ve sırala</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.close}>Kapat</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Section title="Kategori">
            <Choice
              label="Tümü"
              active={!draftFilters.categoryId}
              onPress={() => change("categoryId", undefined)}
            />

            {categories.map((item) => (
              <Choice
                key={item.id}
                label={item.name}
                active={draftFilters.categoryId === item.id}
                onPress={() => change("categoryId", item.id)}
              />
            ))}
          </Section>

          <Section title="Marka">
            <Choice
              label="Tümü"
              active={!draftFilters.brandId}
              onPress={() => change("brandId", undefined)}
            />

            {brands.map((item) => (
              <Choice
                key={item.id}
                label={item.name}
                active={draftFilters.brandId === item.id}
                onPress={() => change("brandId", item.id)}
              />
            ))}
          </Section>

          <Section title="Durum">
            <Choice
              label="Tümü"
              active={!draftFilters.status}
              onPress={() => change("status", undefined)}
            />
            <Choice
              label="Aktif"
              active={draftFilters.status === 1}
              onPress={() => change("status", 1 as ProductStatus)}
            />
            <Choice
              label="Pasif"
              active={draftFilters.status === 2}
              onPress={() => change("status", 2 as ProductStatus)}
            />
            <Choice
              label="Üretim durdu"
              active={draftFilters.status === 3}
              onPress={() => change("status", 3 as ProductStatus)}
            />
          </Section>

          <Section title="Sıralama">
            {sortOptions.map((item) => (
              <Choice
                key={item.value}
                label={item.label}
                active={(draftFilters.sort ?? "updatedAt") === item.value}
                onPress={() => change("sort", item.value)}
              />
            ))}
          </Section>

          <Section title="Yön">
            <Choice
              label={isDateSort ? "En eski önce" : "Artan"}
              active={(draftFilters.dir ?? "desc") === "asc"}
              onPress={() => change("dir", "asc")}
            />
            <Choice
              label={isDateSort ? "En yeni önce" : "Azalan"}
              active={(draftFilters.dir ?? "desc") === "desc"}
              onPress={() => change("dir", "desc")}
            />
          </Section>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable onPress={clearDraft}>
            <Text style={styles.clear}>Tümünü temizle</Text>
          </Pressable>

          <Pressable
            style={styles.done}
            onPress={() => {
              onApply(draftFilters);
              onClose();
            }}
          >
            <Text style={styles.doneText}>Uygula</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

export function ActiveFilterChips({
  query,
  filters,
  categories,
  brands,
  onRemove,
  onClear,
}: {
  query: string;
  filters: FilterState;
  categories: Category[];
  brands: Brand[];
  onRemove: (key: "q" | keyof FilterState) => void;
  onClear: () => void;
}) {
  const isDateSort = (filters.sort ?? "updatedAt") === "updatedAt";
  const customSort =
    (filters.sort ?? "updatedAt") !== "updatedAt" ||
    (filters.dir ?? "desc") !== "desc";
  const chips: Array<{ key: "q" | keyof FilterState; label: string }> = [];
  if (query) chips.push({ key: "q", label: `Arama: ${query}` });

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

  if (customSort) {
    chips.push({
      key: "sort",
      label: `Sıralama: ${{ name: "Ürün adı", price: "Fiyat", stock: "Stok", updatedAt: "Son güncellenen" }[filters.sort ?? "updatedAt"]}`,
    });
    chips.push({
      key: "dir",
      label: `Yön: ${isDateSort ? (filters.dir === "asc" ? "En eski önce" : "En yeni önce") : filters.dir === "asc" ? "Artan" : "Azalan"}`,
    });
  }

  if (!chips.length) return null;
  return (
    <View style={styles.activeWrap}>
      {chips.map((chip) => (
        <Pressable
          key={chip.key}
          style={styles.activeChip}
          onPress={() => onRemove(chip.key)}
        >
          <Text style={styles.activeText}>{chip.label} ×</Text>
        </Pressable>
      ))}

      <Pressable onPress={onClear}>
        <Text style={styles.clearInline}>Temizle</Text>
      </Pressable>
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.choices}>{children}</View>
    </View>
  );
}

function Choice({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, active && styles.choiceActive]}
    >
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f7fb" },
  header: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomColor: "#e3e8f1",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
  },
  title: { color: "#17243a", fontSize: 20, fontWeight: "800" },
  close: { color: "#367dea", fontSize: 14, fontWeight: "800" },
  content: { padding: 20, gap: 22 },
  section: {},
  sectionTitle: {
    color: "#52627a",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  choice: {
    backgroundColor: "#fff",
    borderColor: "#dce4f0",
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  choiceActive: { backgroundColor: "#eaf2ff", borderColor: "#367dea" },
  choiceText: { color: "#52627a", fontSize: 13, fontWeight: "700" },
  choiceTextActive: { color: "#2768ca" },
  footer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopColor: "#e3e8f1",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 16,
    justifyContent: "space-between",
    padding: 16,
  },
  clear: { color: "#b44040", fontSize: 13, fontWeight: "800" },
  done: {
    backgroundColor: "#367dea",
    borderRadius: 10,
    paddingHorizontal: 23,
    paddingVertical: 12,
  },
  doneText: { color: "#fff", fontSize: 14, fontWeight: "800" },
  activeWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 10,
  },
  activeChip: {
    backgroundColor: "#eaf2ff",
    borderRadius: 14,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  activeText: { color: "#2768ca", fontSize: 11, fontWeight: "700" },
  clearInline: {
    color: "#b44040",
    fontSize: 11,
    fontWeight: "800",
    paddingVertical: 6,
  },
});
