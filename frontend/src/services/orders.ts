// src/services/orders.ts
import { request } from './http';

export const createOrder = (customerId: number) => 
  request('/orders', { 
    method: 'POST', 
    body: { customerId },
    auth: true 
  });

export const createOrderWithProducts = (customerId: number, products: {productId: number, amount: number}[]) => 
  request('/orders/with-products', { 
    method: 'POST', 
    body: { customerId, products },
    auth: true 
  });

export const addItemToOrder = (orderId: number, productId: number, amount: number) =>
  request('/orders/add-item', {
    method: 'POST',
    body: { orderId, productId, amount },
    auth: true
  });

export const getOrder = (id: number) => 
  request(`/orders/${id}`, { auth: true });

export const getMyOrders = () => 
  request('/profile/my-orders', { auth: true });

