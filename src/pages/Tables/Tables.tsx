import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { getTables } from "@/http/tables/getTables";
import type { Table } from "@/http/types/tables/Table";
import {
  Loader2,
  LucideTrash2,
  Plus,
  TableIcon,
  Users,
  Clock,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TableCard } from "@/components/TableCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Tables = () => {
  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    location: "",
    status: "available",
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
    if (!formData.name.trim() || !formData.capacity.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (parseInt(formData.capacity) <= 0) {
      alert("A capacidade deve ser maior que zero.");
      return;
    }

    try {
      if (editingTable) {
        // Lógica de edição
        console.log("Editando mesa:", { ...formData, id: editingTable.id });
        alert("Mesa editada com sucesso!");
      } else {
        // Lógica de criação
        console.log("Criando nova mesa:", formData);
        alert("Mesa criada com sucesso!");
      }

      handleCloseForm();
    } catch (error) {
      console.error("Erro ao salvar mesa:", error);
      alert("Erro ao salvar mesa. Tente novamente.");
    }
  };

  const handleNewTable = () => {
    setEditingTable(null);
    setFormData({
      name: "",
      capacity: "",
      location: "",
      status: "available",
    });
    setIsFormOpen(true);
  };

  const handleEditTable = (table: Table) => {
    setEditingTable(table);
    setFormData({
      name: table.name || "",
      capacity: "4", // Valor padrão pois não existe no tipo Table
      location: "", // Valor padrão pois não existe no tipo Table
      status: table.status || "available",
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTable(null);
    setFormData({
      name: "",
      capacity: "",
      location: "",
      status: "available",
    });
  };

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [status, location]);

  const { data: tablesData, isLoading } = getTables({
    page,
    limit: 12,
    searchQuery: debouncedSearchQuery,
    status,
    location,
    is_active: true,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStatus("");
    setLocation("");
    setPage(1);
  };

  const hasActiveFilters = searchQuery || status || location;

  const getStatusBadge = (status: string = "") => {
    const colors = {
      available: "bg-green-100 text-green-800",
      occupied: "bg-red-100 text-red-800",
      reserved: "bg-yellow-100 text-yellow-800",
      maintenance: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string = "") => {
    const labels = {
      available: "Livre",
      occupied: "Ocupada",
      reserved: "Reservada",
      maintenance: "Manutenção",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getStatusIcon = (status: string = "") => {
    switch (status) {
      case "occupied":
        return <Users className="h-4 w-4" />;
      case "reserved":
        return <Clock className="h-4 w-4" />;
      default:
        return <TableIcon className="h-4 w-4" />;
    }
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
              <CardTitle className="mt-1">Mesas</CardTitle>
              <Button
                className="flex items-center gap-2"
                onClick={handleNewTable}
              >
                <Plus className="h-4 w-4" />
                Nova Mesa
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            {isLoading ? (
              <Loader2 className="animate-spin size-6 text-gray-500 items-center" />
            ) : (
              <>
                <div className="filter mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 xl:col-span-1">
                      <Label className="text-sm">Número/Descrição:</Label>
                      <Input
                        type="text"
                        placeholder="Buscar mesa..."
                        className="mt-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="available">Livre</SelectItem>
                          <SelectItem value="occupied">Ocupada</SelectItem>
                          <SelectItem value="reserved">Reservada</SelectItem>
                          <SelectItem value="maintenance">
                            Manutenção
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Label className="text-sm">Localização:</Label>
                      <Select
                        value={location}
                        onValueChange={(value) => setLocation(value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Todas as localizações" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todas</SelectItem>
                          <SelectItem value="salao">Salão</SelectItem>
                          <SelectItem value="varanda">Varanda</SelectItem>
                          <SelectItem value="terraco">Terraço</SelectItem>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {tablesData?.data.length > 0 ? (
                    tablesData?.data.map((table: Table) => (
                      <TableCard
                        key={table.id}
                        table={table}
                        onEdit={handleEditTable}
                        onReserve={() => {}}
                        onRelease={() => {}}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <TableIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p>Nenhuma mesa encontrada.</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end items-center mt-4">
                  <span className="text-sm text-gray-600">
                    Total de registros: {tablesData?.pagination.total || 0}
                  </span>
                </div>
                {tablesData?.pagination && (
                  <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={`text-gray-500 hover:text-gray-700 border ${
                            tablesData?.pagination.current_page === 1
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(tablesData?.pagination.current_page - 1)
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          className={`text-gray-500 hover:text-gray-700 border border-gray-200 pl-4 ${
                            tablesData?.pagination.current_page ===
                            tablesData?.pagination.last_page
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(tablesData?.pagination.current_page + 1)
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

      {/* Modal de Mesa */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingTable ? "Editar Mesa" : "Nova Mesa"}
              </DialogTitle>
              <DialogDescription>
                {editingTable
                  ? `Editando mesa: ${editingTable.name}`
                  : "Preencha os campos abaixo para criar uma nova mesa."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="col-span-3"
                  placeholder="Ex: Mesa 01"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacidade *
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    handleInputChange("capacity", e.target.value)
                  }
                  className="col-span-3"
                  placeholder="Número de pessoas"
                  min="1"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Localização
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="col-span-3"
                  placeholder="Ex: Salão principal"
                />
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
                    <SelectItem value="available">Livre</SelectItem>
                    <SelectItem value="occupied">Ocupada</SelectItem>
                    <SelectItem value="reserved">Reservada</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingTable ? "Salvar Alterações" : "Criar Mesa"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Tables;
