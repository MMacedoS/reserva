import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { Spinner } from "@/components/ui/spinner";
import { useSidebar } from "@/contexts/SidebarContext";
import { useApartments } from "@/http/apartments/useApartments";
import type { Apartment } from "@/http/types/apartments/Apartment";
import { MenuButtons } from "@/shared/components/MenuButtons";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { FormData } from "./Form/FormData";
import { LucidePlusCircle } from "lucide-react";

// Props que o componente aceita
type apartmentsProps = {
  data: Apartment[]
}

export function Apartments() {
    const [page, setPage] = useState(1);
    const limit = 4;

    const { data, isLoading } = useApartments(page, limit); 

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
        },
        {
            id: "actions",
            header: "Ações",
            enableHiding: false, 
            cell: ({ row }) => {
            const apartment = row.original // pega os dados da linha
                return <MenuButtons actions={[
                {
                    label: "Editar",
                    onClick: () => {
                        setSelectedApartment(apartment);
                        setOpenDialog(true)
                    },
                },
                {
                    label: "Excluir",
                    onClick: () => console.log("Excluir", apartment.id),
                },
                {
                    label: "Copiar ID",
                    onClick: () => navigator.clipboard.writeText(apartment.id.toString()),
                },
                ]}/>
            }
        },
    ]

    const {sidebarToggle} = useSidebar();
    
    const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    
    return (
        <div className="col">
            <Sidebar/>            
            <div className={`${sidebarToggle ? 'ml-5' : 'ml-55' } py-20 mr-5  transition-all duration-1000 ease-in-out`}>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="mt-1">Apartamentos</CardTitle>
                        <CardAction onClick={() => {
                            setSelectedApartment(null);
                            setOpenDialog(true);
                            }}>
                            <LucidePlusCircle/>         
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Spinner/>
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
                                        onPageChange: setPage
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
        </div>
    );
}