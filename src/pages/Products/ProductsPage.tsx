import { useEffect, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { getProducts } from "@/http/products/getProducts";
import type { Product } from "@/http/types/products/Product";
import {
  Loader2,
  LucideTrash2,
  Plus,
  Package,
  AlertTriangle,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { ProductFormDialog } from "./Form";
import { useProductForm } from "./hooks";
import { DEFAULT_PRODUCT_CATEGORIES } from "@/constants/productCategories";
import { PermissionGuard } from "@/components/PermissionGuard";

const ProductsPage = () => {
  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState<string>("1");
  const [lowStock, setLowStock] = useState(false);

  const {
    isFormOpen,
    editingProduct,
    handleNewProduct,
    handleEditProduct,
    handleCloseForm,
    handleSubmit,
  } = useProductForm();

  const categories = DEFAULT_PRODUCT_CATEGORIES;

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      setPage(1);
    }
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, status, lowStock]);

  const { data: productsData, isLoading } = getProducts({
    page,
    limit: 12,
    searchQuery: debouncedSearchQuery,
    category_id: categoryId !== "all" ? categoryId : undefined,
    status: status !== "" ? status : undefined,
    low_stock: lowStock,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryId("all");
    setStatus("");
    setLowStock(false);
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery || categoryId !== "all" || status !== "all" || lowStock;

  return (
    <Sidebar>
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="mt-1">Produtos</CardTitle>
              <PermissionGuard requiredPermission={["products.create"]}>
                <Button
                  className="flex items-center gap-2"
                  onClick={handleNewProduct}
                >
                  <Plus className="h-4 w-4" />
                  Novo Produto
                </Button>
              </PermissionGuard>
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
                      <Label className="text-sm">Nome do produto:</Label>
                      <Input
                        type="text"
                        placeholder="Buscar produto..."
                        className="mt-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <Label className="text-sm">Categoria:</Label>
                      <Select
                        value={categoryId}
                        onValueChange={(value) => setCategoryId(value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          {categories?.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id || ""}
                              disabled={!category.is_active}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
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
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="1">Ativo</SelectItem>
                          <SelectItem value="0">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant={lowStock ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLowStock(!lowStock)}
                        className="flex items-center gap-2 mt-1"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Estoque Baixo
                      </Button>
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
                  {productsData?.data.products &&
                  productsData.data.products.length > 0 ? (
                    productsData.data.products.map((product: Product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={handleEditProduct}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p>Nenhum produto encontrado.</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end items-center mt-4">
                  <span className="text-sm text-gray-600">
                    Total de registros: {productsData?.data.pagination.total}
                  </span>
                </div>
                {productsData?.data.pagination && (
                  <Pagination className="flex justify-end mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          className={`text-gray-500 hover:text-gray-700 border ${
                            productsData?.data.pagination.current_page === 1
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(
                              productsData?.data.pagination.current_page - 1
                            )
                          }
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          className={`text-gray-500 hover:text-gray-700 border border-gray-200 pl-4 ${
                            productsData?.data.pagination.current_page ===
                            productsData?.data.pagination.total
                              ? "hidden"
                              : ""
                          }`}
                          onClick={() =>
                            setPage(
                              productsData?.data.pagination.current_page + 1
                            )
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

      <ProductFormDialog
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editingProduct={editingProduct}
        onSubmit={handleSubmit}
      />
    </Sidebar>
  );
};

export default ProductsPage;
