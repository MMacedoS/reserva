import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSales } from "@/http/sales/getSales";
import type { Sale } from "@/http/types/sales/Sale";
import { Loader2, LucideTrash2, Plus, ShoppingCart } from "lucide-react";
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
import { SaleCard } from "@/components/SaleCard";
import { SaleItemsDialog } from "@/components/SaleItemsDialog";
import { SaleFormDialog } from "./Form";
import { useSaleForm } from "./hooks";

const SalesPage = () => {
  const hoje = new Date();
  const dataInicialPadrao = addDays(hoje, -7).toISOString().split("T")[0];
  const dataFinalPadrao = hoje.toISOString().split("T")[0];

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(dataInicialPadrao);
  const [endDate, setEndDate] = useState(dataFinalPadrao);
  const [status, setStatus] = useState("all");
  const [itemsDialogSale, setItemsDialogSale] = useState<Sale | null>(null);

  const {
    isFormOpen,
    editingSale,
    handleNewSale,
    handleEditSale,
    handleCloseForm,
    handleSubmit,
    handleCloseSale,
    handleCancelSale,
  } = useSaleForm();

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, status]);

  const { data: salesData, isLoading } = getSales({
    page,
    limit: 12,
    searchQuery: debouncedSearchQuery,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    status: status !== "all" ? status : undefined,
  });

  const sales = salesData?.data?.sales || [];
  const pagination = salesData?.data?.pagination;

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(dataInicialPadrao);
    setEndDate(dataFinalPadrao);
    setStatus("all");
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    status !== "all" ||
    startDate !== dataInicialPadrao ||
    endDate !== dataFinalPadrao;

  const handleManageItems = (sale: Sale) => {
    setItemsDialogSale(sale);
  };

  const handleCloseItemsDialog = () => {
    setItemsDialogSale(null);
  };

  return (
    <Sidebar>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="mt-1">Vendas</CardTitle>
            <Button className="flex items-center gap-2" onClick={handleNewSale}>
              <Plus className="h-4 w-4" />
              Nova Venda
            </Button>
          </div>
        </CardHeader>
        <CardContent className="h-full">
          {isLoading ? (
            <Loader2 className="animate-spin size-6 text-gray-500 items-center" />
          ) : (
            <>
              <div className="filter mb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  <div className="lg:col-span-2 xl:col-span-2">
                    <Label className="text-sm">Cliente/Mesa:</Label>
                    <Input
                      type="text"
                      placeholder="Buscar venda..."
                      className="mt-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
                    <Label className="text-sm">Data inicial:</Label>
                    <Input
                      type="date"
                      className="mt-1"
                      value={startDate}
                      max={endDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="w-full">
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
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Finalizada">Finalizada</SelectItem>
                        <SelectItem value="Cancelada">Cancelada</SelectItem>
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
              <div className="grid grid-cols-1 md:grid-cols-3  gap-4">
                {sales && sales.length > 0 ? (
                  sales.map((sale: Sale) => (
                    <SaleCard
                      key={sale.id}
                      sale={sale}
                      onEdit={handleEditSale}
                      onClose={handleCloseSale}
                      onCancel={handleCancelSale}
                      onManageItems={handleManageItems}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p>Nenhuma venda encontrada.</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end items-center mt-4">
                <span className="text-sm text-gray-600">
                  Total de registros: {pagination?.total || 0}
                </span>
              </div>
              {pagination && (
                <Pagination className="flex justify-end mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={`text-gray-500 hover:text-gray-700 border ${
                          pagination.current_page === 1 ? "hidden" : ""
                        }`}
                        onClick={() => setPage(pagination.current_page - 1)}
                      />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext
                        className={`text-gray-500 hover:text-gray-700 border border-gray-200 pl-4 ${
                          pagination.current_page === pagination.last_page
                            ? "hidden"
                            : ""
                        }`}
                        onClick={() => setPage(pagination.current_page + 1)}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <SaleFormDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingSale={editingSale}
        onSubmit={handleSubmit}
      />

      <SaleItemsDialog
        isOpen={!!itemsDialogSale}
        onClose={handleCloseItemsDialog}
        sale={itemsDialogSale}
      />
    </Sidebar>
  );
};

export default SalesPage;
