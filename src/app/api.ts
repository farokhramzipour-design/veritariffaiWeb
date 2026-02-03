export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.veritariffai.co';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const LEGACY_TOKEN_KEY = 'vtai_access_token';
let refreshPromise: Promise<string | null> | null = null;

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string) {
  setAccessToken(accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function clearTokens() {
  clearAccessToken();
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`,
        {
          method: 'POST',
          headers: { accept: 'application/json' },
        }
      );
      if (!response.ok) {
        clearTokens();
        return null;
      }
      const data = (await response.json()) as { access_token: string; refresh_token: string };
      setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    } catch {
      clearTokens();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function requestWithRefresh(
  input: RequestInfo,
  init: RequestInit,
  signal?: AbortSignal
) {
  const response = await fetch(input, { ...init, signal });
  if (response.status !== 401) return response;

  const newToken = await refreshAccessToken();
  if (!newToken) return response;

  const retryHeaders = buildHeaders(init.headers);
  return fetch(input, { ...init, headers: retryHeaders, signal });
}

function buildHeaders(headers?: HeadersInit) {
  const token = getAccessToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  } as HeadersInit;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await requestWithRefresh(
    `${API_BASE_URL}${path}`,
    {
      credentials: 'include',
      headers: buildHeaders(),
    },
    signal
  );
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function apiGetOptionalJson<T>(
  path: string,
  signal?: AbortSignal
): Promise<T | null> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    signal,
    credentials: 'include',
    headers: buildHeaders(),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

export async function apiPostForm<T>(
  path: string,
  body: URLSearchParams
): Promise<T> {
  const response = await requestWithRefresh(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json',
    }),
    body,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function apiPostJson<T>(path: string, body: unknown): Promise<T> {
  const response = await requestWithRefresh(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders({
      'Content-Type': 'application/json',
      accept: 'application/json',
    }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function apiPostFile<T>(path: string, body: FormData): Promise<T> {
  const response = await requestWithRefresh(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: buildHeaders({
      accept: 'application/json',
    }),
    body,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}
