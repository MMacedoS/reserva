import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { getCashbox } from "@/http/cashbox/getCashbox";
import type { Cashbox } from "@/http/types/cashbox/Cashbox";
import { Loader2 } from "lucide-react";
import CardListCash from "@/components/CardListCash";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Footer from "@/components/layout/Footer";

const Finance = () => {
  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);

  const { data: financeData, isLoading } = getCashbox(page);

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
          <CardContent className="h-full">
            {isLoading ? (
              <Loader2 className="animate-spin size-6 text-gray-500 items-center" />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {financeData?.data.length > 0 ? (
                    financeData?.data.map((cashbox: Cashbox) => (
                      <CardListCash key={cashbox.id} cashbox={cashbox} />
                    ))
                  ) : (
                    <p>Nenhuma caixa registrada.</p>
                  )}
                </div>
                <div className="flex justify-end items-center mt-4">
                  <span className="text-sm text-gray-600">
                    Total de registros: {financeData?.pagination.total || 0}
                  </span>
                </div>
                {financeData?.pagination && (
                  <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={`text-gray-500 hover:text-gray-700 border ${
                            financeData?.pagination.current_page === 1
                              ? "hidden"
                              : ""
                          }`}
                          lang="pt-br"
                          onClick={() =>
                            setPage(financeData?.pagination.current_page - 1)
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          className={`text-gray-500 hover:text-gray-700 border border-gray-200 pl-4 ${
                            financeData?.pagination.current_page ===
                            financeData?.pagination.last_page
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(financeData?.pagination.current_page + 1)
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Finance;
