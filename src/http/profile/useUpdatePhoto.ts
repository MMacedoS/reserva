import { useMutation } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

export function UseUpdatePhoto() {
  const { user, updateUser } = useAuth();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationFn: async (data: { file: File }) => {
      if (!data.file) {
        throw new Error("arquivo é obrigatorio");
      }

      const formData = new FormData();
      formData.append("file", data.file);

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/profile/${user?.id}/photo`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();
      return result;
    },
    onSuccess: async (data) => {
      const userData = data.data || data;

      if (userData) {
        updateUser(userData);
      } else {
        console.error("Nenhum dado de usuário encontrado na resposta");
      }

      showAutoDismissAlert({
        message: "Foto atualizada com sucesso!",
        description: "A imagem foi atualizada.",
        duration: 2000,
      });
    },
  });
}
