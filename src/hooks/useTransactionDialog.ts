import { useState } from "react";
import { useTransactionsByCashboxId } from "@/http/finance/transactions/getTransactionsCashboxByCashboxId";

interface UseTransactionDialogProps {
  cashBoxId: string;
}

export function useTransactionDialog({ cashBoxId }: UseTransactionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useTransactionsByCashboxId({
    cashBoxId,
    page,
    limit: 10,
    enabled: isOpen,
  });

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    setPage(1);
  };

  return {
    isOpen,
    openDialog,
    closeDialog,
    setIsOpen,
    page,
    setPage,
    transactions,
    isLoading,
    error,
    refetch,
  };
}
