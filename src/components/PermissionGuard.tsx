import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredAccess?: string[];
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  requiredPermission,
  requiredAccess,
  fallback = <div className="text-center py-4 text-red-600">Acesso negado</div>,
}: PermissionGuardProps) {
  const { user, permissions } = useAuth();

  // Verifica se tem permissão específica
  if (requiredPermission && permissions) {
    const hasPermission = permissions.includes(requiredPermission);
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // Verifica se tem nível de acesso necessário
  if (requiredAccess && user) {
    const hasAccess = requiredAccess.includes(user.access);
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
