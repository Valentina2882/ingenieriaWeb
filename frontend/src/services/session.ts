// src/services/session.ts
export const setToken = (t: string) => localStorage.setItem('token', t);
export const getToken = () => localStorage.getItem('token');
export const clearToken = () => localStorage.removeItem('token');