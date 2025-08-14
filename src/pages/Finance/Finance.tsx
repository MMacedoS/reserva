import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { getCashbox } from "@/http/cashbox/getCashbox";
import type { Cashbox } from "@/http/types/cashbox/Cashbox";
import { Loader2 } from "lucide-react";
import CardListCash from "@/components/CardListCash";

const Finance = () => {
  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);
  const limit = 2;

  const { data: financeData, isLoading } = getCashbox(page, limit);

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
            <CardTitle className="mt-1">Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="animate-spin size-6 text-gray-500 items-center" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financeData?.data.length > 0 ? (
                  financeData?.data.map((cashbox: Cashbox) => (
                    <CardListCash key={cashbox.id} cashbox={cashbox} />
                  ))
                ) : (
                  <p>Nenhuma caixa registrada.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Finance;
