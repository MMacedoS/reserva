import { useState } from "react";
import type { Product, ProductRequest } from "@/http/types/products/Product";
import { useSaveProduct } from "@/http/products/saveProduct";
import { useUpdateProduct } from "@/http/products/updateProduct";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export const useProductForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const saveProductMutation = useSaveProduct();
  const updateProductMutation = useUpdateProduct();

  const handleNewProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData: ProductRequest) => {
    try {
      if (editingProduct && editingProduct.id) {
        // Atualizar produto existente - PUT /products/{uuid}
        await updateProductMutation.mutateAsync({
          id: editingProduct.id,
          data: formData,
        });

        showAutoDismissAlert({
          message: "Sucesso!",
          description: `Produto "${formData.name}" atualizado com sucesso!`,
        });
      } else {
        // Criar novo produto - POST /products
        await saveProductMutation.mutateAsync(formData);

        showAutoDismissAlert({
          message: "Sucesso!",
          description: `Produto "${formData.name}" criado com sucesso!`,
        });
      }
    } catch (error) {
      console.error("Erro ao salvar produto:", error);

      showAutoDismissAlert({
        message: "Erro!",
        description: "Erro ao salvar produto. Tente novamente.",
      });

      throw error; // Re-throw para que o FormData possa lidar com o estado de carregamento
    }
  };

  return {
    isFormOpen,
    editingProduct,
    handleNewProduct,
    handleEditProduct,
    handleCloseForm,
    handleSubmit,
    isLoading: saveProductMutation.isPending || updateProductMutation.isPending,
  };
};
