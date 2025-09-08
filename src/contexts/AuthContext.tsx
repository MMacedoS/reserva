import { environment } from "@/environments/environment";
import type { userResponse } from "@/http/types/profile/userResponse";
import type { Cashbox } from "@/http/types/cashbox/Cashbox";
import React, { createContext, useState, useEffect } from "react";
import type { Permission } from "@/http/types/permissions/Permission";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { title } from "process";

interface AuthContextType {
  user: userResponse | null;
  token: string | null;
  permissions: Permission[] | null;
  cashbox: Cashbox | null;
  login: (email: string, password: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  updateUser: (data: Partial<userResponse>) => void;
  updateCashbox: (cashboxData: Cashbox | null) => void;
  updatePermissions: (permissions: Permission[]) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[] | null>(null);
  const [cashbox, setCashbox] = useState<Cashbox | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const savedPermissions = localStorage.getItem("permissions");
    const savedCashbox = localStorage.getItem("cashbox");

    if (savedToken) setToken(savedToken);

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Erro ao fazer parse do usuário:", error);
        localStorage.removeItem("user");
      }
    }

    if (savedPermissions) {
      try {
        setPermissions(JSON.parse(savedPermissions));
      } catch (error) {
        console.error("Erro ao fazer parse das permissões:", error);
        localStorage.removeItem("permissions");
      }
    }

    if (savedCashbox) {
      try {
        setCashbox(JSON.parse(savedCashbox));
      } catch (error) {
        console.error("Erro ao fazer parse do cashbox:", error);
        localStorage.removeItem("cashbox");
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await fetch(
      `${environment.apiUrl}/${environment.apiVersion}/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      setIsLoading(false);
      throw new Error("Usuário ou senha inválidos");
    }

    const data = await res.json();

    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.permissions) {
      setPermissions(data.permissions);
      localStorage.setItem("permissions", JSON.stringify(data.permissions));
    }

    if (data.cashbox) {
      setCashbox(data.cashbox);
      localStorage.setItem("cashbox", JSON.stringify(data.cashbox));
    }

    setIsLoading(false);
  };

  const refreshToken = async () => {
    const res = await fetch(
      `${environment.apiUrl}/${environment.apiVersion}/token/refresh`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) throw new Error("Erro ao renovar token");

    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem("token", data.access_token);
    showAutoDismissAlert({
      message: "Sessão renovada",
      description:
        "Sua sessão foi renovada com sucesso. envie novamente sua requisição.",
      duration: 3000,
    });
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

  const updateCashbox = (cashboxData: Cashbox | null) => {
    setCashbox(cashboxData);
    if (cashboxData) {
      localStorage.setItem("cashbox", JSON.stringify(cashboxData));
    } else {
      localStorage.removeItem("cashbox");
    }
  };

  const updatePermissions = (newPermissions: Permission[]) => {
    setPermissions(newPermissions);
    localStorage.setItem("permissions", JSON.stringify(newPermissions));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPermissions(null);
    setCashbox(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("cashbox");
  };

  const getToken = () => token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        cashbox,
        login,
        refreshToken,
        logout,
        getToken,
        updateUser,
        updateCashbox,
        updatePermissions,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
