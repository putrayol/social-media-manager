export function apiUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').trim();
  if (!base) return path;
  // Ensure we don't end up with double slashes
  if (base.endsWith('/') && path.startsWith('/')) {
    return base.slice(0, -1) + path;
  }
  return base + path;
}

export async function apiFetch(path: string, init?: RequestInit) {
  const url = apiUrl(path);
  return fetch(url, init);
}
