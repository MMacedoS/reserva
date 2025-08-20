import { useState } from "react";
import type { Sale, SaleRequest } from "@/http/types/sales/Sale";
import { useSaleOperations } from "@/hooks/useSaleOperations";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export const useSaleForm = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const { createSale, updateSale, closeSale, cancelSale, loading } =
    useSaleOperations();

  const handleNewSale = () => {
    setEditingSale(null);
    setIsFormOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSale(null);
  };

  const handleSubmit = async (formData: SaleRequest) => {
    formData.reservation_id = formData.reservation_id || null;

    try {
      if (editingSale && editingSale.id) {
        // Atualizar venda existente
        await updateSale(editingSale.id, formData);

        showAutoDismissAlert({
          message: "Sucesso!",
          description: `Venda "${
            formData.sale_name || editingSale.id
          }" atualizada com sucesso!`,
        });
      } else {
        // Criar nova venda
        await createSale(formData);

        showAutoDismissAlert({
          message: "Sucesso!",
          description: `Venda "${formData.sale_name}" criada com sucesso!`,
        });
      }

      handleCloseForm();
    } catch (error) {
      console.error("Erro ao salvar venda:", error);

      showAutoDismissAlert({
        message: "Erro!",
        description: "Erro ao salvar venda. Tente novamente.",
      });

      throw error;
    }
  };

  const handleCloseSale = async (sale: Sale) => {
    try {
      await closeSale(sale);

      showAutoDismissAlert({
        message: "Sucesso!",
        description: "Venda finalizada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);
      showAutoDismissAlert({
        message: "Erro!",
        description: `${error}`,
        duration: 5000,
      });
    }
  };

  const handleCancelSale = async (saleId: string) => {
    try {
      await cancelSale(saleId);

      showAutoDismissAlert({
        message: "Sucesso!",
        description: "Venda cancelada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao cancelar venda:", error);

      showAutoDismissAlert({
        message: "Erro!",
        description: "Erro ao cancelar venda. Tente novamente.",
      });
    }
  };

  return {
    isFormOpen,
    editingSale,
    handleNewSale,
    handleEditSale,
    handleCloseForm,
    handleSubmit,
    handleCloseSale,
    handleCancelSale,
    isLoading: loading,
  };
};
