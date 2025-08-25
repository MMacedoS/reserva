import { getCustomers } from "@/http/customers/getCustomers";
import { MenuButtons } from "@/shared/components/MenuButtons";
import { DataTable } from "@/components/ui/DataTable";
import { LucideFolderPen, LucideTrash2, LucidePlusCircle } from "lucide-react";
import { useState } from "react";
import { FormData } from "./Form/FormData";
import { AlertDialogDestroy } from "@/components/ui/alertDialogDestroy";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import Footer from "@/components/layout/Footer";

export default function CustomerPage() {
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { data, refetch } = getCustomers({ page });
  const { sidebarToggle } = useSidebar();

  const handleDelete = async () => {
    if (!selectedCustomer) return;
    setOpenConfirmDialog(false);
    setSelectedCustomer(null);
    refetch();
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      id: "actions",
      header: "Ações",
      enableHiding: false,
      cell: ({ row }: any) => {
        const customer = row.original;
        return (
          <MenuButtons
            actions={[
              {
                label: <LucideFolderPen className="size-6" />,
                onClick: () => {
                  setSelectedCustomer(customer);
                  setOpenDialog(true);
                },
              },
              {
                label: <LucideTrash2 className="size-6" />,
                onClick: () => {
                  setSelectedCustomer(customer);
                  setOpenConfirmDialog(true);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5  transition-all duration-1000 ease-in-out`}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="mt-1">Clientes</CardTitle>
            <CardAction
              onClick={() => {
                setSelectedCustomer(null);
                setOpenDialog(true);
              }}
            >
              <LucidePlusCircle />
            </CardAction>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              filterColumn="name"
              filterPlaceholder="Filtrar por nome..."
              pagination={
                data && data.pagination
                  ? {
                      current_page: data.pagination.current_page ?? page,
                      last_page: data.pagination.last_page ?? 1,
                      total: data.pagination.total ?? 0,
                      onPageChange: setPage,
                    }
                  : undefined
              }
            />
          </CardContent>
        </Card>
      </div>
      <FormData
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />
      <AlertDialogDestroy
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleDelete}
        item={selectedCustomer}
        type="cliente"
      />
      <Footer />
    </div>
  );
}
