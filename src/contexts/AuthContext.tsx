import type { userResponse } from "@/http/types/profile/userResponse";
import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: userResponse | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (data: {status:number, data: userResponse}) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setIsLoading(false);
  }, []); 

  const login = async (email: string, password: string) => {
    const response = await fetch("http://sistemareserva.localhost:8080/api/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Erro no login");
    }

    const data = await response.json();

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    console.log();
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  const updateUser = (res: { status: number; data: userResponse }) => {
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, updateUser, logout, isAuthenticated: !!token, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
