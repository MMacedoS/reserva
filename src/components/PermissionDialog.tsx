import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { getPermissions } from "@/http/permissions/getPermissions";
import { getPermissionsByUser } from "@/http/permissions/getPermissionsByUser";
import { useAssignPermission } from "@/http/permissions/assignPermission";
import { useAuth } from "@/hooks/useAuth";
import type { Employee } from "@/http/types/employees/Employee";
import type { Permission } from "@/http/types/permissions/Permission";

interface PermissionDialogProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export function PermissionDialog({
  open,
  onClose,
  employee,
}: PermissionDialogProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const { user, permissions: userLoggedPermissions } = useAuth();

  const isCurrentUser = user?.id === employee?.id;

  const { data: allPermissions, isLoading: isLoadingPermissions } =
    getPermissions();

  const { data: userPermissions, isLoading: isLoadingUserPermissions } =
    getPermissionsByUser(employee?.id || "", {
      enabled: !!employee?.id && !isCurrentUser,
    });

  const { mutateAsync: assignPermission, isPending } = useAssignPermission();

  useEffect(() => {
    if (!employee?.id || !Array.isArray(allPermissions)) {
      setSelectedPermissions([]);
      return;
    }

    if (isCurrentUser && userLoggedPermissions) {
      let userPermissionIds: string[] = [];

      if (
        Array.isArray(userLoggedPermissions) &&
        userLoggedPermissions.length > 0 &&
        typeof userLoggedPermissions[0] === "object" &&
        "id" in userLoggedPermissions[0]
      ) {
        userPermissionIds = userLoggedPermissions.map(
          (permission: any) => permission.id
        );
      }

      if (
        userPermissionIds.length === 0 &&
        Array.isArray(userLoggedPermissions)
      ) {
        userPermissionIds = allPermissions
          .filter((permission) => {
            const hasPermission = (userLoggedPermissions as any[]).some(
              (userPerm: any) =>
                userPerm === permission.name ||
                userPerm.name === permission.name
            );
            return hasPermission;
          })
          .map((permission) => permission.id);
      }

      setSelectedPermissions(userPermissionIds);
      return;
    }

    if (userPermissions?.permissions) {
      const permissionIds = userPermissions.permissions.map(
        (permission) => permission.id
      );
      setSelectedPermissions(permissionIds);
      return;
    }

    if (!isCurrentUser) {
      console.log("Resetting selected permissions for non-current user");
      setSelectedPermissions([]);
    }
  }, [
    userPermissions,
    userLoggedPermissions,
    allPermissions,
    isCurrentUser,
    employee?.id,
  ]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      if (checked) {
        return [...prev, permissionId];
      }
      return prev.filter((id) => id !== permissionId);
    });
  };

  const handleSelectAll = () => {
    if (Array.isArray(allPermissions)) {
      const allPermissionIds = allPermissions.map(
        (permission) => permission.id
      );
      setSelectedPermissions(allPermissionIds);
    }
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const allSelected =
    Array.isArray(allPermissions) &&
    allPermissions.length > 0 &&
    selectedPermissions.length === allPermissions.length;

  const handleSave = async () => {
    if (!employee) return;

    try {
      await assignPermission({
        userId: employee.id,
        permissions: selectedPermissions,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
    }
  };

  const groupedPermissions = Array.isArray(allPermissions)
    ? allPermissions.reduce((acc, permission) => {
        const module = permission.module || "Geral";
        if (!acc[module]) {
          acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
      }, {} as Record<string, Permission[]>)
    : {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Gerenciar Permissões</DialogTitle>
          <DialogDescription>
            Gerencie as permissões para {employee?.name}
            {Array.isArray(allPermissions) && (
              <span className="block mt-1 text-sm">
                {selectedPermissions.length} de {allPermissions.length}{" "}
                permissões selecionadas
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoadingPermissions ||
        (isLoadingUserPermissions && !isCurrentUser) ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={allSelected}
              >
                Marcar Todas
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedPermissions.length === 0}
              >
                Desmarcar Todas
              </Button>
            </div>

            <div className="max-h-96 overflow-y-auto pr-4 py-5">
              <div className="space-y-6">
                {groupedPermissions &&
                  Object.entries(groupedPermissions).map(
                    ([module, permissions]) => (
                      <div key={module} className="space-y-3">
                        <h3 className="font-medium text-lg border-b pb-2">
                          {module}
                        </h3>
                        <div className="grid grid-cols-3 gap-3 ml-4">
                          {permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-2"
                            >
                              <Checkbox
                                id={permission.id}
                                checked={selectedPermissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(
                                    permission.id,
                                    checked as boolean
                                  )
                                }
                              />
                              <Label
                                htmlFor={permission.id}
                                className="text-sm font-normal cursor-pointer flex-1"
                              >
                                <div>
                                  <div className="font-medium">
                                    {permission.name}
                                  </div>
                                  {permission.description && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {permission.description}
                                    </div>
                                  )}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
