import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import type { Customer } from "@/http/types/Customer/Customer";
import { MenuButtons } from "@/shared/components/MenuButtons";
import type { ColumnDef } from "@tanstack/react-table";
import { LucideCookingPot, LucideFolderPen } from "lucide-react";

const CustomerPage = () => {
  const { sidebarToggle } = useSidebar();

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

  const columns: ColumnDef<Customer>[] = [
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
                onClick: () => {},
              },
              {
                label: <LucideCookingPot className="size-6" />,
                onClick: () => {},
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
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default CustomerPage;
