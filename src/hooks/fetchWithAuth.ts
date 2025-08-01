import { useAuth } from "@/contexts/AuthContext";

export const useFetchWithAuth = () => {
  const { logout } = useAuth();

  const fetchWithAuth = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    const token = localStorage.getItem("token");

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("last_url", currentPath);

      logout(); 
    }

    return response;
  };

  return { fetchWithAuth };
};
