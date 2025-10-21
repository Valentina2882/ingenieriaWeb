// src/services/auth.ts
import { request } from './http';
export const login = (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: { email, password } });