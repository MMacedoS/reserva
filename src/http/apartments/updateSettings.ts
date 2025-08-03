import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { settingResponse } from "../types/settings/settingResponse";

type ApiResponse = { status: number; data: settingResponse };

type CreateSettingFormData = {
  company_name: string;
  email: string;
  cnpj: string;
  phone: string;
  address: string;
  checkin: string;
  checkout: string;
  percentage_service_fee: string;
  cleaning_rate: string;
  allow_booking_online: string;
  cancellation_policies: string;
};

export function updateSettings() {
  const { fetchWithAuth } = useApi();

  return useMutation<
    ApiResponse, 
    Error,        
    CreateSettingFormData
  >({
    mutationFn: async (data: CreateSettingFormData) => {      
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro ao salvar: ${errorBody || response.statusText}`);
      }

      const result = await response.json();
      return result;
    },
    onSuccess: ({data}) => {
      showAutoDismissAlert({
        message: "Dados salvos com sucesso!",
        description: "Os dados foram atualizados.",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      showAutoDismissAlert({
        message: "Erro ao salvar dados",
        description: error.message || "Erro desconhecido",
        duration: 4000,
      });
    },
  });
}
