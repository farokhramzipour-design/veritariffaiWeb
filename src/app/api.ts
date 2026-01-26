export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal, credentials: 'include' });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
