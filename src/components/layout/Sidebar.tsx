import { useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useSidebar } from "@/contexts/SidebarContext";
import Footer from "./Footer";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { sidebarToggle, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      toggleSidebar();
    }
  }, [isMobile]);

  return (
    <div className="col">
      <div className="w-full flex fixed z-50">
        <Header
          sidebarToggle={sidebarToggle}
          setSidebarToggle={toggleSidebar}
        />
        <Navbar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={toggleSidebar}
        />
      </div>

      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 transition-all duration-1000 ease-in-out px-5`}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
}
