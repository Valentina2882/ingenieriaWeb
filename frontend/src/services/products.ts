// src/services/products.ts
import { request } from './http';
export const listProducts = (q?: Record<string, string | number>) => {
  const qs = q ? '?' + new URLSearchParams(q as any).toString() : '';
  return request('/products' + qs);
};
export const getProduct = (id: number) => request(`/products/${id}`);
export const createProduct = (dto: any) => request('/products', { method: 'POST', body: dto });
