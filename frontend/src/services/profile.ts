
// src/services/profile.ts (JWT)
import { request } from './http';
export const getMe = () => request('/profile/my-user', { auth: true });
export const getMyOrders = () => request('/profile/my-orders', { auth: true });
export const createCustomer = (data: { name: string; lastName: string; phone: string }) => 
  request('/profile/create-customer', { method: 'POST', body: data, auth: true });