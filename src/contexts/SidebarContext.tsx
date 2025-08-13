// src/contexts/SidebarContext.tsx
import { createContext, useContext, useState, useCallback } from "react";

interface SidebarContextType {
  sidebarToggle: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggleSidebar = useCallback(
    () => setSidebarToggle((prev) => !prev),
    []
  );

  return (
    <SidebarContext.Provider value={{ sidebarToggle, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider");
  }
  return context;
};
