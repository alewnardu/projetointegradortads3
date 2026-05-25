import { useAuth } from './useAuth';

export function useAuthenticatedFetch() {

  const { token } = useAuth();

  return async (url, options = {}) => {

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`
    };

    return fetch(url, {
      ...options,
      headers
    });
  };
}