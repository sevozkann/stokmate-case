import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type {
  AuthResponse,
  Brand,
  Category,
  Supplier,
  PagedResult,
  Product,
  ProductInput,
  ProductQuery,
} from "../../types";

const SESSION_KEY = "stokmate.session";
const fallbackUrl =
  Platform.OS === "android" ? "http://10.0.2.2:5080" : "http://localhost:5080";
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? fallbackUrl;
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
let session: AuthResponse | null = null;
let refreshRequest: Promise<AuthResponse> | null = null;

export async function restoreSession() {
  const value = await AsyncStorage.getItem(SESSION_KEY);
  session = value ? JSON.parse(value) : null;
  return session;
}

async function saveSession(next: AuthResponse | null) {
  session = next;
  next
    ? await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(next))
    : await AsyncStorage.removeItem(SESSION_KEY);
}

async function read<T>(response: Response): Promise<T> {
  if (response.ok)
    return response.status === 204
      ? (undefined as T)
      : (response.json() as Promise<T>);
  throw new ApiError(
    response.status,
    (await response.text()) || "İstek tamamlanamadı.",
  );
}

async function refresh() {
  if (!session) throw new ApiError(401, "Oturum bulunamadı.");

  if (!refreshRequest)
    refreshRequest = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
      .then(read<AuthResponse>)
      .then(async (next) => {
        await saveSession(next);
        return next;
      })
      .finally(() => {
        refreshRequest = null;
      });
  return refreshRequest;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");

  if (session) headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401 && retry && session) {
    try {
      await refresh();
      return request<T>(path, init, false);
    } catch {
      await saveSession(null);
      throw new ApiError(
        401,
        "Oturumunuz sona erdi. Lütfen yeniden giriş yapın.",
      );
    }
  }
  return read<T>(response);
}

export const api = {
  session: () => session,
  login: async (email: string, password: string) => {
    const result = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await saveSession(result);
    return result;
  },
  logout: async () => {
    try {
      if (session)
        await request<void>("/auth/logout", {
          method: "POST",
          body: JSON.stringify({ refreshToken: session.refreshToken }),
        });
    } finally {
      await saveSession(null);
    }
  },
  products: (query: ProductQuery, signal?: AbortSignal) => {
    const p = new URLSearchParams();
    if (query.q) p.set("q", query.q);
    if (query.categoryId) p.set("categoryId", String(query.categoryId));
    if (query.brandId) p.set("brandId", String(query.brandId));
    if (query.status) p.set("status", String(query.status));
    if (query.sort) p.set("sort", query.sort);
    if (query.dir) p.set("dir", query.dir);
    p.set("page", String(query.page));
    p.set("pageSize", String(query.pageSize));
    return request<PagedResult<Product>>(`/products?${p}`, { signal });
  },
  categories: () => request<Category[]>("/categories"),
  brands: () => request<Brand[]>("/brands"),
  suppliers: () => request<Supplier[]>("/suppliers"),
  updateStock: (id: number, stock: number) =>
    request<Product>(`/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify({ stock }),
    }),
  updateProduct: (id: number, product: ProductInput) =>
    request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(product),
    }),
};
