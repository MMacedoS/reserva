import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReservationFormDialog } from "./Form/ReservationFormDialog";
import { Sidebar } from "@/components/layout/Sidebar";

export default function ReservationCreatePage() {
  const [searchParams] = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const apartmentId = searchParams.get("apartment_id");

  useEffect(() => {
    // Abre automaticamente o diálogo quando a página carrega
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Redireciona de volta para as reservas quando fechar
    window.history.back();
  };

  return (
    <Sidebar>
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Criar Nova Reserva
          </h1>

          {apartmentId && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                <strong>Apartamento selecionado:</strong> {apartmentId}
              </p>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Preencha os detalhes para criar uma nova reserva
            {apartmentId ? " para o apartamento selecionado." : "."}
          </p>
        </div>
      </div>

      <ReservationFormDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        apartmentId={apartmentId}
      />
    </Sidebar>
  );
}
