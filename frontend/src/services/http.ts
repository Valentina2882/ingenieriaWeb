//src/services/http.ts
export const BASE_URL = 'http://localhost:3000/api/v1';

export async function request(path: string, options?: {
  method?: string;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers || {}),
  };
  if (options?.auth && token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: options?.method || 'GET',
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, data };
  return data;
}