import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface PermissionGuardProps {
  children: ReactNode;
  requiredPermission?: string[];
  requiredAccess?: string[];
  fallback?: ReactNode;
}

export function PermissionGuard({
  children,
  requiredPermission,
  requiredAccess,
  fallback = "",
}: PermissionGuardProps) {
  const { user, permissions } = useAuth();

  if (requiredPermission && permissions) {
    const hasPermission = requiredPermission.every((perm) =>
      permissions.includes(perm)
    );
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  if (requiredAccess && user) {
    const hasAccess = requiredAccess.includes(user.access);
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}
