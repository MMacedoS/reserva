import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";

const Sales = () => {
  const { sidebarToggle } = useSidebar();
  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="mt-1">Vendas</CardTitle>
          </CardHeader>
          <CardContent className="h-full"></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Sales;
