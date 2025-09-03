import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCashbox } from "@/http/cashbox/getCashbox";
import type { Cashbox } from "@/http/types/cashbox/Cashbox";
import { Loader2, LucideTrash2 } from "lucide-react";
import CardListCash from "@/components/CardListCash";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addDays } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FinancePage = () => {
  const hoje = new Date();
  const dataInicialPadrao = addDays(hoje, -7).toISOString().split("T")[0];
  const dataFinalPadrao = hoje.toISOString().split("T")[0];

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(dataInicialPadrao);
  const [endDate, setEndDate] = useState(dataFinalPadrao);
  const [status, setStatus] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, status]);

  const { data: financeData, isLoading } = getCashbox({
    page,
    limit: 10,
    searchQuery: debouncedSearchQuery,
    startDate,
    endDate,
    status,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(dataInicialPadrao);
    setEndDate(dataFinalPadrao);
    setPage(1);
    setStatus("");
  };

  const hasActiveFilters =
    searchQuery ||
    status ||
    startDate !== dataInicialPadrao ||
    endDate !== dataFinalPadrao;

  return (
    <Sidebar>
      <Card>
        <CardHeader>
          <CardTitle className="mt-1">Caixas Financeiros</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {isLoading ? (
            <Loader2 className="animate-spin size-6 text-gray-500 items-center" />
          ) : (
            <>
              <div className="filter mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <div className="lg:col-span-2 xl:col-span-1">
                    <Label className="text-sm">Descrição:</Label>
                    <Input
                      type="text"
                      placeholder="Buscar caixa..."
                      className="mt-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="min-w-[150px]">
                    <Label className="text-sm">Data inicial:</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      value={startDate}
                      max={endDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="min-w-[150px]">
                    <Label className="text-sm">Data final:</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      value={endDate}
                      min={startDate}
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <Label className="text-sm">Status:</Label>
                    <Select
                      value={status}
                      onValueChange={(value) => setStatus(value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Todos os status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="fechado">Fechado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {hasActiveFilters && (
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="flex items-center gap-2 mt-1"
                        title="Limpar filtros"
                      >
                        <LucideTrash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Limpar</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
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
    </Sidebar>
  );
};

export default FinancePage;
