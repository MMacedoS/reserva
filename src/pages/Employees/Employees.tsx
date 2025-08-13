import { useState } from "react";
import {
  LucideFolderPen,
  LucidePlusCircle,
  LucideCookingPot,
} from "lucide-react";
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
import { useEmployees } from "@/http/employees/useEmployees";
import { useDeleteEmployee } from "@/http/employees/deleteEmployee";
import { FormData } from "./Form/FormData";
import { AlertDialogDestroy } from "@/components/ui/alertDialogDestroy";
import { MenuButtons } from "@/shared/components/MenuButtons";
import type { Employee } from "@/http/types/employees/Employee";
import type { ColumnDef } from "@tanstack/react-table";

export function Employees() {
  const { sidebarToggle } = useSidebar();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const { data: employees = [], isLoading } = useEmployees();
  const { mutateAsync: destroyEmployee } = useDeleteEmployee();

  const getStatusBadge = (active: number | string) => {
    const isActive = Number(active) === 1;
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isActive ? "Ativo" : "Inativo"}
      </span>
    );
  };

  const getAccessBadge = (access: string) => {
    const colors = {
      administrador: "bg-purple-100 text-purple-800",
      gerente: "bg-blue-100 text-blue-800",
      funcionario: "bg-gray-100 text-gray-800",
      recepcionista: "bg-orange-100 text-orange-800",
      recepcionista_bar: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[access as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }`}
      >
        {access.charAt(0).toUpperCase() + access.slice(1).replace("_", " ")}
      </span>
    );
  };

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "access",
      header: "Acesso",
      cell: ({ row }) => getAccessBadge(row.getValue("access")),
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("active")),
    },
    {
      id: "actions",
      header: "Ações",
      enableHiding: false,
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <MenuButtons
            actions={[
              {
                label: <LucideFolderPen className="size-6" />,
                onClick: () => {
                  setSelectedEmployee(employee);
                  setOpenDialog(true);
                },
              },
              {
                label: <LucideCookingPot className="size-6" />,
                onClick: () => {
                  setSelectedEmployee(employee);
                  setOpenConfirmDialog(true);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    await destroyEmployee(selectedEmployee.id);

    setOpenConfirmDialog(false);
  };

  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="mt-1">Funcionários</CardTitle>
            <CardAction
              onClick={() => {
                setSelectedEmployee(null);
                setOpenDialog(true);
              }}
            >
              <LucidePlusCircle />
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Spinner />
            ) : (
              <div className="w-full">
                <DataTable
                  columns={columns}
                  data={employees}
                  filterColumn="name"
                  filterPlaceholder="Filtrar por nome..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FormData
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        employee={selectedEmployee}
      />
      <AlertDialogDestroy
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleDelete}
        employee={selectedEmployee}
      />
    </div>
  );
}
