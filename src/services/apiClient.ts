/**
-- ==============================================================================
-- CENTRAL API CLIENT (SERVICE LAYER)
-- Strictly pure async HTTP fetch wrapper attaching Authorization: Bearer <token>.
-- Reads backend base URL strictly from process.env.NEXT_PUBLIC_API_URL
-- ==============================================================================
*/

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  let url = `${BASE_URL}${endpoint}`;

  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  // Retrieve token from localStorage if in browser
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('print_platform_token');
  }

  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = responseData.error || responseData.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  // Unwrap backend API format: { success: true, data: ... }
  return (responseData.data !== undefined ? responseData.data : responseData) as T;
}

