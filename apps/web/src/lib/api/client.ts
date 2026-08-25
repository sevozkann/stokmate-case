import type {
  AuthResponse,
  Brand,
  Category,
  PagedResult,
  Product,
  ProductInput,
  ProductQuery,
  Supplier,
} from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080";
const SESSION_KEY = "stokmate.session";
type Session = AuthResponse;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

let session: Session | null = JSON.parse(
  localStorage.getItem(SESSION_KEY) ?? "null",
);
let onSessionExpired: (() => void) | undefined;
let refreshPromise: Promise<Session> | null = null;

export const authStore = {
  get: () => session,
  set: (next: Session | null) => {
    session = next;
    next
      ? localStorage.setItem(SESSION_KEY, JSON.stringify(next))
      : localStorage.removeItem(SESSION_KEY);
  },
  onExpired: (callback: () => void) => {
    onSessionExpired = callback;
  },
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok)
    return response.status === 204
      ? (undefined as T)
      : (response.json() as Promise<T>);
  throw new ApiError(
    response.status,
    (await response.text()) || "İstek işlenemedi.",
  );
}

async function refreshSession(): Promise<Session> {
  if (!session) throw new ApiError(401, "Oturum bulunamadı.");

  if (!refreshPromise) {
    refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
      .then(parseResponse<Session>)
      .then((next) => {
        authStore.set(next);
        return next;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(init.headers);

  headers.set("Content-Type", "application/json");

  if (session) headers.set("Authorization", `Bearer ${session.accessToken}`);

  const response = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (response.status === 401 && retry && session) {
    try {
      await refreshSession();
      return request<T>(path, init, false);
    } catch {
      authStore.set(null);
      onSessionExpired?.();
      throw new ApiError(
        401,
        "Oturumunuz sona erdi. Lütfen yeniden giriş yapın.",
      );
    }
  }
  return parseResponse<T>(response);
}

export const api = {
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () =>
    request<void>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken: session?.refreshToken }),
    }),
  products: (query: ProductQuery, signal?: AbortSignal) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(
      ([key, value]) =>
        value !== undefined && value !== "" && params.set(key, String(value)),
    );
    return request<PagedResult<Product>>(`/products?${params}`, { signal });
  },
  categories: () => request<Category[]>("/categories"),
  brands: () => request<Brand[]>("/brands"),
  suppliers: () => request<Supplier[]>("/suppliers"),
  updateProduct: (id: number, input: ProductInput) =>
    request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
};
