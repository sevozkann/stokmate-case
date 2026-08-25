export type ProductStatus = 1 | 2 | 3;

export interface User {
  id: number;
  email: string;
  fullName: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  imageUrl: string;
  categoryId: number;
  categoryName: string;
  brandId: number;
  brandName: string;
  supplierId: number;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: number;
  status: ProductStatus;
  isFeatured: boolean;
  description: string;
  updatedAt: string;
}

export interface ProductInput {
  name: string;
  sku: string;
  barcode: string;
  categoryId: number;
  brandId: number;
  supplierId: number;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: number;
  status: ProductStatus;
  description: string;
  isFeatured: boolean;
}

export interface ProductQuery {
  q?: string;
  categoryId?: number;
  brandId?: number;
  status?: ProductStatus;
  page: number;
  pageSize: number;
  sort?: string;
  dir?: "asc" | "desc";
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
