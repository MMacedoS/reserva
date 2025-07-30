import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { useState } from "react";

function Dashboard() {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  return (
    <div className="w-full block flex">
      <Header sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle} />
      <Navbar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle}/>
    </div>
  );
}
export default Dashboard;