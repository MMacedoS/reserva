import { Package, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/http/types/products/Product";
import { formatValueToBRL } from "@/lib/utils";
import { PermissionGuard } from "./PermissionGuard";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onSelect?: (product: Product) => void;
  selectable?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onSelect,
  selectable = false,
}: ProductCardProps) {
  const getAvailabilityBadge = () => {
    if (product.status === "inactive") {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    if (product.stock_quantity === 0 || product.stock === 0) {
      return <Badge variant="outline">Sem Estoque</Badge>;
    }
    if ((product.stock_quantity || product.stock || 0) <= 5) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">Estoque Baixo</Badge>
      );
    }
    return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
  };

  const isLowStock = (product.stock_quantity || product.stock || 0) <= 5;

  return (
    <Card
      className={`p-4 ${selectable ? "cursor-pointer hover:bg-gray-50" : ""} ${
        isLowStock ? "border-yellow-300" : ""
      }`}
      onClick={selectable ? () => onSelect?.(product) : undefined}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium truncate">
            {product.name || "Produto sem nome"}
          </h3>
          {isLowStock && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </div>

        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Preço:</span>
            <p className="font-medium">{formatValueToBRL(product.price)}</p>
          </div>
          <div>
            <span className="text-gray-500">Estoque:</span>
            <p className="font-medium">
              {product.stock_quantity || product.stock || 0} un
            </p>
          </div>
          {product.category && (
            <div className="col-span-2">
              <span className="text-gray-500">Categoria:</span>
              <p className="font-medium">{product.category}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          {getAvailabilityBadge()}
          <PermissionGuard requiredPermission={["products.edit"]}>
            {!selectable && (
              <div className="flex gap-1">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(product)}
                  >
                    Editar
                  </Button>
                )}
              </div>
            )}
          </PermissionGuard>
        </div>
      </div>
    </Card>
  );
}
