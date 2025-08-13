import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";

const Finance = () => {
  const { sidebarToggle } = useSidebar();

  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <h1 className="text-2xl font-bold">Financeiro</h1>
      </div>
    </div>
  );
};

export default Finance;
