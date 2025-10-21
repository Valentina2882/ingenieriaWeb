// src/services/categories.ts (JWT)
import { request } from './http';
export const listCategories = () => request('/categories', { auth: true });
