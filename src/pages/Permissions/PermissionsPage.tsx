import { useState } from "react";
import { LucideFolderPen, LucidePlusCircle } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Spinner } from "@/components/ui/spinner";
import { FormData } from "./Form/FormData";
import { PermissionGuard } from "@/components/PermissionGuard";
import type { Permission } from "@/http/types/permissions/Permission";
import type { ColumnDef } from "@tanstack/react-table";
import { getPermissionsPaginated } from "@/http/permissions/getPermissionsPaginated";

export function PermissionsPage() {
  const [page, setPage] = useState(1);
  const { sidebarToggle } = useSidebar();
  const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data, isLoading } = getPermissionsPaginated(page);

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Descrição",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="text-sm text-gray-600 max-w-xs truncate">
            {description || "Sem descrição"}
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Data de Criação",
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        return (
          <div className="text-sm text-gray-600">
            {date ? new Date(date).toLocaleDateString("pt-BR") : "N/A"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const permission = row.original;
        return (
          <div className="flex items-center gap-2">
            <PermissionGuard requiredAccess={["administrador"]}>
              <button
                onClick={() => handleEdit(permission)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                title="Editar permissão"
              >
                <LucideFolderPen className="w-4 h-4 text-blue-600" />
              </button>
            </PermissionGuard>
          </div>
        );
      },
    },
  ];

  const handleEdit = (permission: Permission) => {
    setSelectedPermission(permission);
    setOpenDialog(true);
  };

  const handleCreate = () => {
    setSelectedPermission(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPermission(null);
  };

  return (
    <Sidebar>
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarToggle ? "ml-0" : "ml-50"
        }`}
      >
        <div className="py-20">
          <div className="max-w-7xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      Gerenciamento de Permissões
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Gerencie as permissões do sistema
                    </p>
                  </div>
                  <PermissionGuard requiredAccess={["administrador"]}>
                    <CardAction>
                      <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        <LucidePlusCircle className="w-4 h-4 mr-2" />
                        Nova Permissão
                      </button>
                    </CardAction>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={data?.data || []}
                    filterPlaceholder="Buscar permissões..."
                    filterColumn="name"
                    pagination={{
                      current_page: data?.pagination.current_page,
                      last_page: data?.pagination.last_page,
                      total: data?.pagination.total,
                      onPageChange: setPage,
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FormData
        open={openDialog}
        onClose={handleCloseDialog}
        permission={selectedPermission}
      />
    </Sidebar>
  );
}
