import { useState } from "react";
import { Header } from "./Header";
import { Navbar } from "./Navbar";
import { useSidebar } from "@/contexts/SidebarContext";

export function Sidebar() {
    const { sidebarToggle, toggleSidebar } = useSidebar();
     
    return (
        <div className="w-full block flex">
          <Header sidebarToggle={sidebarToggle} setSidebarToggle={toggleSidebar} />
          <Navbar sidebarToggle={sidebarToggle} setSidebarToggle={toggleSidebar}/>
        </div>
      );
}