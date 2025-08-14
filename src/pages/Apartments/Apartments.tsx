import { Sidebar } from "@/components/layout/Sidebar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Spinner } from "@/components/ui/spinner";
import { useSidebar } from "@/contexts/SidebarContext";
import type { Apartment } from "@/http/types/apartments/Apartment";
import { MenuButtons } from "@/shared/components/MenuButtons";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { FormData } from "./Form/FormData";
import {
  LucideCookingPot,
  LucideFolderPen,
  LucidePlusCircle,
} from "lucide-react";
import { AlertDialogDestroy } from "@/components/ui/alertDialogDestroy";
import { deleteApartment } from "@/http/apartments/deleteApartment";
import { getApartments } from "@/http/apartments/getApartments";

export function Apartments() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = getApartments(page);
  const { sidebarToggle } = useSidebar();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(
    null
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const columns: ColumnDef<Apartment>[] = [
    {
      accessorKey: "name",
      header: "Apartamento",
    },
    {
      accessorKey: "category",
      header: "Categoria",
    },
    {
      accessorKey: "situation",
      header: "Situação",
      cell: ({ row }) => getStatusBadge(row.getValue("situation")),
    },
    {
      id: "actions",
      header: "Ações",
      enableHiding: false,
      cell: ({ row }) => {
        const apartment = row.original; // pega os dados da linha
        return (
          <MenuButtons
            actions={[
              {
                label: <LucideFolderPen className="size-6" />,
                onClick: () => {
                  setSelectedApartment(apartment);
                  setOpenDialog(true);
                },
              },
              {
                label: <LucideCookingPot className="size-6" />,
                onClick: () => {
                  setSelectedApartment(apartment);
                  setOpenConfirmDialog(true);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const { mutateAsync: destroyApartments } = deleteApartment();

  const handleDelete = async () => {
    if (!selectedApartment) return;

    await destroyApartments(selectedApartment);

    setOpenConfirmDialog(false);
  };

  const getStatusBadge = (access: string) => {
    const colors = {
      Disponivel: "bg-green-100 text-green-800",
      Ocupado: "bg-blue-100 text-blue-800",
      Impedido: "bg-red-100 text-red-800",
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
            <CardTitle className="mt-1">Apartamentos</CardTitle>
            <CardAction
              onClick={() => {
                setSelectedApartment(null);
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
                  data={data?.data || []}
                  filterColumn="name"
                  filterPlaceholder="Filtrar por nome..."
                  pagination={{
                    current_page: data?.pagination.current_page,
                    last_page: data?.pagination.last_page,
                    total: data?.pagination.total,
                    onPageChange: setPage,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <FormData
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        apartment={selectedApartment}
      />
      <AlertDialogDestroy
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleDelete}
        apartment={selectedApartment}
      />
    </div>
  );
}
