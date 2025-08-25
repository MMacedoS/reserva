import { useAuth } from "./useAuth";

export const useApi = () => {
  const { getToken, refreshToken, logout } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const originalHeaders =
      options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : options.headers ?? {};

    let headers = {
      ...originalHeaders,
      Authorization: `Bearer ${getToken()}`,
    };

    let response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    if (response.status === 401) {
      try {
        await refreshToken();

        headers = {
          ...originalHeaders,
          Authorization: `Bearer ${getToken()}`,
        };

        response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });
      } catch (err) {
        logout();
        throw err;
      }
    }

    return response;
  };

  return { fetchWithAuth };
};
