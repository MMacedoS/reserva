import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const lastUrl = localStorage.getItem("last_url");
    if (isAuthenticated && lastUrl) {
      localStorage.removeItem("last_url");
      navigate(lastUrl);
    }
  }, [isAuthenticated]);

  return (
    <Sidebar/>
  );
}
export default Dashboard;