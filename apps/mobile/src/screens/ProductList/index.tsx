import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../lib/api/client";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ActiveFilterChips, FilterSheet } from "./ProductFilters";
import { EmptyState, ErrorState, LoadingState } from "../../components/feedback";
import { ProductRow } from "./ProductRow";
import type { Brand, Category, Product, ProductQuery } from "../../types";

const pageSize = 12;

type Filters = Pick<
  ProductQuery,
  "categoryId" | "brandId" | "status" | "sort" | "dir"
>;

export function ProductsScreen({
  onSelect,
}: {
  onSelect: (p: Product) => void;
}) {
  const [items, setItems] = useState<Product[]>([]),
    [query, setQuery] = useState(""),
    [filters, setFilters] = useState<Filters>({
      sort: "updatedAt",
      dir: "desc",
    }),
    [page, setPage] = useState(1),
    [total, setTotal] = useState(0),
    [loading, setLoading] = useState(true),
    [refreshing, setRefreshing] = useState(false),
    [error, setError] = useState(""),
    [open, setOpen] = useState(false),
    [categories, setCategories] = useState<Category[]>([]),
    [brands, setBrands] = useState<Brand[]>([]);
  const requestId = useRef(0);
  const loadedPageRef = useRef(1);
  const debouncedQuery = useDebouncedValue(query, 350);
  const requestFilters = useMemo<ProductQuery>(
    () => ({
      q: debouncedQuery || undefined,
      ...filters,
      page: 1,
      pageSize,
    }),
    [
      debouncedQuery,
      filters.brandId,
      filters.categoryId,
      filters.dir,
      filters.sort,
      filters.status,
    ],
  );

  const load = useCallback(
    async (next = 1, append = false, signal?: AbortSignal) => {
      const currentRequestId = ++requestId.current;
      if (next === 1) setLoading(true);
      try {
        const result = await api.products(
          {
            ...requestFilters,
            page: next,
            pageSize,
          },
          signal,
        );
        if (signal?.aborted || currentRequestId !== requestId.current) return;
        setItems((old) => (append ? [...old, ...result.items] : result.items));
        setPage(result.page);
        loadedPageRef.current = result.page;
        setTotal(result.total);
        setError("");
      } catch (e) {
        if (signal?.aborted || currentRequestId !== requestId.current) return;
        setError(e instanceof Error ? e.message : "Ürünler yüklenemedi.");
      } finally {
        if (!signal?.aborted && currentRequestId === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [requestFilters],
  );

  const refreshLoadedPages = useCallback(async () => {
    const lastLoadedPage = loadedPageRef.current;
    if (lastLoadedPage === 1) {
      await load();
      return;
    }

    const currentRequestId = ++requestId.current;
    try {
      const results = await Promise.all(
        Array.from({ length: lastLoadedPage }, (_, index) =>
          api.products({ ...requestFilters, page: index + 1, pageSize }),
        ),
      );
      if (currentRequestId !== requestId.current) return;

      setItems(results.flatMap((result) => result.items));
      setTotal(results[0]?.total ?? 0);
      setError("");
    } catch (e) {
      if (currentRequestId !== requestId.current) return;
      setError(e instanceof Error ? e.message : "Ürünler yenilenemedi.");
    }
  }, [load, requestFilters]);

  useEffect(() => {
    void Promise.all([api.categories(), api.brands()]).then(([c, b]) => {
      setCategories(c);
      setBrands(b);
    });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(1, false, controller.signal);
    return () => controller.abort();
  }, [load]);

  useEffect(() => {
    const id = setInterval(() => void refreshLoadedPages(), 8_000);
    return () => clearInterval(id);
  }, [refreshLoadedPages]);

  const change = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((old) => ({ ...old, [key]: value }));
  const clear = () => {
    setQuery("");
    setFilters({ sort: "updatedAt", dir: "desc" });
  };

  const remove = (key: "q" | keyof Filters) =>
    key === "q"
      ? setQuery("")
      : change(
          key,
          key === "sort"
            ? "updatedAt"
            : key === "dir"
              ? "desc"
              : (undefined as never),
        );

  if (loading && !items.length)
    return <LoadingState label="Ürünler yükleniyor…" />;

  return (
    <View style={s.page}>
      <View style={s.header}>
        <View>
          <Text style={s.overline}>KATALOG</Text>
          <Text style={s.title}>Ürünler</Text>
          <Text style={s.subtitle}>
            Fiyat, stok ve ürün bilgilerini yönetin.
          </Text>
        </View>

        <Pressable style={s.filter} onPress={() => setOpen(true)}>
          <Text style={s.filterText}>Filtrele</Text>
        </Pressable>
      </View>

      <View style={s.search}>
        <Ionicons name="search-outline" size={20} color="#8aa0bf" />
        <TextInput
          style={s.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Ürün adı veya stok kodu ara"
        />
      </View>

      <ActiveFilterChips
        query={query}
        filters={filters}
        categories={categories}
        brands={brands}
        onRemove={remove}
        onClear={clear}
      />
      <View style={s.listInfo}>
        <Text style={s.listCount}>
          {items.length} / {total} ürün gösteriliyor
        </Text>
        <Text style={s.listUpdate}>
          Son güncelleme anlık olarak kontrol edilir
        </Text>
      </View>
      <View style={s.columnHeaders}>
        <Text style={s.columnHeader}>ÜRÜN BİLGİSİ</Text>
        <Text style={s.columnHeader}>STOK</Text>
      </View>
      {error && !items.length ? (
        <ErrorState message={error} onRetry={() => void load()} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(x) => String(x.id)}
          renderItem={({ item }) => (
            <ProductRow product={item} onPress={() => onSelect(item)} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void load();
              }}
            />
          }
          ListEmptyComponent={<EmptyState />}
          ListFooterComponent={
            items.length < total ? (
              <Pressable
                style={s.more}
                onPress={() => void load(page + 1, true)}
              >
                <Text style={s.moreText}>Daha fazla göster</Text>
              </Pressable>
            ) : null
          }
        />
      )}

      <FilterSheet
        visible={open}
        filters={filters}
        categories={categories}
        brands={brands}
        onApply={setFilters}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { backgroundColor: "#f5f7fb", flex: 1, paddingHorizontal: 20 },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 18,
    paddingTop: 24,
  },
  overline: {
    color: "#6d8ebd",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: { color: "#17243a", fontSize: 30, fontWeight: "800" },
  subtitle: { color: "#718098", fontSize: 12, marginTop: 3 },
  filter: { backgroundColor: "#eaf2ff", borderRadius: 9, padding: 10 },
  filterText: { color: "#2768ca", fontWeight: "800" },
  search: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#e0e6f0",
    borderRadius: 11,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    height: 48,
    marginBottom: 12,
    paddingHorizontal: 13,
  },
  searchInput: { color: "#17243a", flex: 1, fontSize: 15 },
  listInfo: {
    backgroundColor: "#fff",
    borderColor: "#e3e8f1",
    borderRadius: 12,
    borderWidth: 1,
    gap: 3,
    marginBottom: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  listCount: { color: "#17243a", fontSize: 13, fontWeight: "800" },
  listUpdate: { color: "#718098", fontSize: 11 },
  columnHeaders: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  columnHeader: {
    color: "#718098",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  more: { alignSelf: "center", padding: 13 },
  moreText: { color: "#367dea", fontWeight: "800" },
});
