import { environment } from "@/environments/environment";
import type { userResponse } from "@/http/types/profile/userResponse";
import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  user: userResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  updateUser: (data: Partial<userResponse>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await fetch(`${environment.apiUrl}/${environment.apiVersion}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setIsLoading(false);
      throw new Error("Usuário ou senha inválidos");
    }

    const data = await res.json();

    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    setIsLoading(false);
  };

  const refreshToken = async () => {
    const res = await fetch(`${environment.apiUrl}/${environment.apiVersion}/token/refresh`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Erro ao renovar token");

    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
  };

  const updateUser = (data: Partial<userResponse>) => {
    setUser((prevUser) => {
      if (!prevUser) throw new Error("Usuário não autenticado");

      const updatedUser: userResponse = {
        ...prevUser,
        ...data,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        refreshToken,
        logout,
        getToken,
        updateUser,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
