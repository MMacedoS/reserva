import { useAuth } from "./useAuth";

export function useCashbox() {
  const { cashbox, updateCashbox } = useAuth();

  const isCashboxOpen = !!cashbox && cashbox.status === "aberto";

  const openCashbox = (cashboxData: any) => {
    updateCashbox(cashboxData);
  };

  const closeCashbox = () => {
    updateCashbox(null);
  };

  return {
    cashbox,
    isCashboxOpen,
    openCashbox,
    closeCashbox,
  };
}
