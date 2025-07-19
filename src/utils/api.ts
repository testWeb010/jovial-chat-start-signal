import Cookies from 'js-cookie';

/**
 * Utility function to make API requests with JSON content type and Authorization header
 * @param url The API endpoint URL
 * @param options Fetch options
 * @returns Promise with the response data
 */
export const apiRequestJson = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  return response.json();
};
