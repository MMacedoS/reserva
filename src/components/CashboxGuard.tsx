import type { ReactNode } from "react";
import { useCashbox } from "@/hooks/useCashbox";

interface CashboxGuardProps {
  children: ReactNode;
  requireCashbox?: boolean;
  fallback?: ReactNode;
}

export function CashboxGuard({
  children,
  requireCashbox = true,
  fallback = null,
}: CashboxGuardProps) {
  const { isCashboxOpen } = useCashbox();

  if (requireCashbox && !isCashboxOpen) {
    return fallback;
  }

  return <>{children}</>;
}
