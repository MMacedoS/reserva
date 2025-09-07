import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MinusIcon, Plus, PlusIcon, Trash2 } from "lucide-react";
import { getProducts } from "@/http/products/getProducts";
import { useGetSaleItems } from "@/http/sales/getSaleItems";
import { useAddSaleItem } from "@/http/sales/addSaleItem";
import { useUpdateSaleItem } from "@/http/sales/updateSaleItem";
import { useRemoveSaleItem } from "@/http/sales/removeSaleItem";
import { useSyncSaleAmount } from "@/http/sales/syncSaleAmount";
import type { Product } from "@/http/types/products/Product";
import type { SaleItem } from "@/http/types/sales/Sale";
import { formatValueToBRL } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";

interface SaleItemsManagerProps {
  saleId: string;
  readOnly?: boolean;
}

export const SaleItemsManager = ({
  saleId,
  readOnly = false,
}: SaleItemsManagerProps) => {
  const [newItem, setNewItem] = useState({
    product_id: "",
    product_name: "",
    quantity: 1,
    unit_price: 0,
  });

  const { sidebarToggle } = useSidebar();

  const { data: saleItemsData, isLoading } = useGetSaleItems(saleId);
  const { data: productsData } = getProducts({
    page: 1,
    limit: 100,
    status: "1",
  });

  const addItemMutation = useAddSaleItem();
  const updateItemMutation = useUpdateSaleItem();
  const removeItemMutation = useRemoveSaleItem();
  const syncSaleAmountMutation = useSyncSaleAmount();

  const items = Array.isArray(saleItemsData?.data?.itens)
    ? saleItemsData.data.itens
    : [];

  const products = productsData?.data.products || [];

  const addItem = async () => {
    if (
      !newItem.product_id ||
      !newItem.product_name ||
      newItem.quantity <= 0 ||
      newItem.unit_price <= 0
    ) {
      return;
    }

    try {
      await addItemMutation.mutateAsync({
        sale_id: saleId,
        product_id: newItem.product_id,
        quantity: newItem.quantity,
        unit_price: newItem.unit_price,
      });

      await syncSaleAmountMutation.mutateAsync(saleId);

      setNewItem({
        product_id: "",
        product_name: "",
        quantity: 1,
        unit_price: 0,
      });
    } catch (error) {}
  };

  const removeItem = async (itemId: string) => {
    try {
      await removeItemMutation.mutateAsync({
        sale_id: saleId,
        item_id: itemId,
      });
      await syncSaleAmountMutation.mutateAsync(saleId);
    } catch (error) {}
  };

  const [quantity, setQuantity] = useState(1);

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateItemMutation.mutateAsync({
        sale_id: saleId,
        item_id: itemId,
        quantity,
      });
      await syncSaleAmountMutation.mutateAsync(saleId);
    } catch (error) {}
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (product) {
      setNewItem({
        product_id: productId,
        product_name: product.name || "",
        quantity: 1,
        unit_price: product.price || 0,
      });
    }
  };

  const totalValue = items.reduce(
    (sum: number, item: SaleItem) => sum + (item.total || 0),
    0
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Itens da Venda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando itens...</div>
        </CardContent>
      </Card>
    );
  }

  const handleDecrement = (itemIndicator: string) => {
    setQuantity((prev) => {
      const newValue = prev > 1 ? prev - 1 : prev;
      updateItemQuantity(itemIndicator, newValue);
      return newValue === 1 ? 1 : newValue;
    });
  };

  const handleIncrement = (itemIndicator: string) => {
    setQuantity((prev) => {
      const newValue = prev + 1;
      updateItemQuantity(itemIndicator, newValue);
      return newValue === 1 ? 1 : newValue;
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Itens da Venda</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-y-auto">
        {!readOnly && (
          <div className="mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Produto</Label>
                <Select
                  value={newItem.product_id}
                  onValueChange={handleProductSelect}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product: Product) => (
                      <SelectItem key={product.id} value={product.id || "all"}>
                        {product.name} - {formatValueToBRL(product.price || 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 1,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Preço Unitário</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newItem.unit_price}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      unit_price: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addItem}
                  className="w-full"
                  disabled={addItemMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addItemMutation.isPending ? "Adicionando..." : "Adicionar"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Qtd</TableHead>
              {!sidebarToggle && <TableHead>Preço Unit.</TableHead>}
              {!sidebarToggle && <TableHead>Total</TableHead>}
              {!readOnly && <TableHead className="w-20">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item: SaleItem) => (
              <TableRow key={item.id}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>
                  {readOnly ? (
                    item.quantity
                  ) : (
                    <div className="flex w-[100px] items-center justify-between rounded-3xl border">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDecrement(item.id || "")}
                      >
                        <MinusIcon />
                      </Button>
                      <p>{quantity}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleIncrement(item.id || "")}
                      >
                        <PlusIcon />
                      </Button>
                    </div>
                  )}
                </TableCell>

                {!sidebarToggle && (
                  <>
                    <TableCell>
                      {formatValueToBRL(item.product_price) || "0,00"}
                    </TableCell>
                    <TableCell>
                      {formatValueToBRL(item.total) || "0,00"}
                    </TableCell>
                  </>
                )}
                {!readOnly && (
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id || "")}
                      disabled={removeItemMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={readOnly ? 4 : 5}
                  className="text-center text-gray-500"
                >
                  Nenhum item adicionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end">
          <div className="text-lg font-semibold">
            Total: {formatValueToBRL(totalValue)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
