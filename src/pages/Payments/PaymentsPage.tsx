import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { getPayments } from "@/http/payments/getPayments";
import type { Payment } from "@/http/types/payments/Payment";
import {
  Loader2,
  LucideTrash2,
  CreditCard,
  DollarSign,
  Smartphone,
  Receipt,
  Plus,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PaymentsPage = () => {
  const hoje = new Date();
  const dataInicialPadrao = addDays(hoje, -7).toISOString().split("T")[0];
  const dataFinalPadrao = hoje.toISOString().split("T")[0];

  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(dataInicialPadrao);
  const [endDate, setEndDate] = useState(dataFinalPadrao);
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState({
    sale_id: "",
    amount: "",
    method: "",
    status: "pending",
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!formData.sale_id.trim() || !formData.amount.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    try {
      if (editingPayment) {
        // Lógica de edição
        console.log("Editando pagamento:", {
          ...formData,
          id: editingPayment.id,
        });
        alert("Pagamento editado com sucesso!");
      } else {
        // Lógica de criação
        console.log("Criando novo pagamento:", formData);
        alert("Pagamento criado com sucesso!");
      }

      handleCloseForm();
    } catch (error) {
      console.error("Erro ao salvar pagamento:", error);
      alert("Erro ao salvar pagamento. Tente novamente.");
    }
  };

  const handleNewPayment = () => {
    setEditingPayment(null);
    setFormData({
      sale_id: "",
      amount: "",
      method: "",
      status: "pending",
    });
    setIsFormOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setFormData({
      sale_id: payment.sale_id || "",
      amount: payment.amount?.toString() || "",
      method: payment.method || "",
      status: payment.status || "pending",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPayment(null);
    setFormData({
      sale_id: "",
      amount: "",
      method: "",
      status: "pending",
    });
  };

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, method, status]);

  const { data: paymentsData, isLoading } = getPayments({
    page,
    limit: 10,
    searchQuery: debouncedSearchQuery,
    startDate,
    endDate,
    method: method !== "all" ? method : undefined,
    status: status !== "all" ? status : undefined,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(dataInicialPadrao);
    setEndDate(dataFinalPadrao);
    setMethod("all");
    setStatus("all");
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    method !== "all" ||
    status !== "all" ||
    startDate !== dataInicialPadrao ||
    endDate !== dataFinalPadrao;

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      completed: "Concluído",
      cancelled: "Cancelado",
      failed: "Falhou",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "debit_card":
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "pix":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    const labels = {
      cash: "Dinheiro",
      debit_card: "Cartão de Débito",
      credit_card: "Cartão de Crédito",
      pix: "PIX",
      transfer: "Transferência",
      other: "Outro",
    };
    return labels[method as keyof typeof labels] || method;
  };

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
            <div className="flex justify-between items-center">
              <CardTitle className="mt-1">Pagamentos</CardTitle>
              <Button
                className="flex items-center gap-2"
                onClick={handleNewPayment}
              >
                <Plus className="h-4 w-4" />
                Novo Pagamento
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            {isLoading ? (
              <Loader2 className="animate-spin size-6 text-gray-500 items-center" />
            ) : (
              <>
                <div className="filter mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    <div className="lg:col-span-1 xl:col-span-1">
                      <Label className="text-sm">Referência:</Label>
                      <Input
                        type="text"
                        placeholder="Buscar pagamento..."
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
                      <Label className="text-sm">Método:</Label>
                      <Select
                        value={method}
                        onValueChange={(value) => setMethod(value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Todos os métodos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="cash">Dinheiro</SelectItem>
                          <SelectItem value="debit_card">
                            Cartão de Débito
                          </SelectItem>
                          <SelectItem value="credit_card">
                            Cartão de Crédito
                          </SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="transfer">
                            Transferência
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="completed">Concluído</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="failed">Falhou</SelectItem>
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
                <div className="space-y-4">
                  {paymentsData?.data.length > 0 ? (
                    paymentsData?.data.map((payment: Payment) => (
                      <Card key={payment.id} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getMethodIcon(payment.method)}
                              <span className="font-medium">
                                {getMethodLabel(payment.method)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {payment.reference && `Ref: ${payment.reference}`}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Valor</p>
                            <p className="font-medium text-lg">
                              R$ {payment.amount.toFixed(2)}
                            </p>
                            {payment.installments &&
                              payment.installments > 1 && (
                                <p className="text-xs text-gray-500">
                                  {payment.installments}x
                                </p>
                              )}
                          </div>

                          <div>
                            <p className="text-sm text-gray-500">Data</p>
                            <p className="font-medium">
                              {payment.processed_at
                                ? format(
                                    new Date(payment.processed_at),
                                    "dd/MM/yyyy"
                                  )
                                : format(
                                    new Date(payment.created_at!),
                                    "dd/MM/yyyy"
                                  )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {payment.processed_at
                                ? format(
                                    new Date(payment.processed_at),
                                    "HH:mm"
                                  )
                                : format(
                                    new Date(payment.created_at!),
                                    "HH:mm"
                                  )}
                            </p>
                          </div>

                          <div>
                            <Badge className={getStatusBadge(payment.status)}>
                              {getStatusLabel(payment.status)}
                            </Badge>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPayment(payment)}
                            >
                              Editar
                            </Button>
                            <Button size="sm" variant="outline">
                              Ver Detalhes
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p>Nenhum pagamento encontrado.</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end items-center mt-4">
                  <span className="text-sm text-gray-600">
                    Total de registros: {paymentsData?.pagination.total || 0}
                  </span>
                </div>
                {paymentsData?.pagination && (
                  <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={`text-gray-500 hover:text-gray-700 border ${
                            paymentsData?.pagination.current_page === 1
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(paymentsData?.pagination.current_page - 1)
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          className={`text-gray-500 hover:text-gray-700 border border-gray-200 pl-4 ${
                            paymentsData?.pagination.current_page ===
                            paymentsData?.pagination.last_page
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(paymentsData?.pagination.current_page + 1)
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

      {/* Modal de Pagamento */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingPayment ? "Editar Pagamento" : "Novo Pagamento"}
              </DialogTitle>
              <DialogDescription>
                {editingPayment
                  ? `Editando pagamento: R$ ${editingPayment.amount?.toFixed(
                      2
                    )}`
                  : "Preencha os campos abaixo para criar um novo pagamento."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sale_id" className="text-right">
                  ID da Venda *
                </Label>
                <Input
                  id="sale_id"
                  value={formData.sale_id}
                  onChange={(e) => handleInputChange("sale_id", e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: 12345"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Valor *
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="col-span-3"
                  placeholder="0,00"
                  min="0.01"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="method" className="text-right">
                  Método *
                </Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => handleInputChange("method", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                    <SelectItem value="credit_card">
                      Cartão de Crédito
                    </SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="failed">Falhado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingPayment ? "Salvar Alterações" : "Criar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PaymentsPage;
