import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchWithAuth } from "@/hooks/fetchWithAuth";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export function UseUpdatePhoto() {
    const { user, token, updateUser } = useAuth();
    const { fetchWithAuth } = useFetchWithAuth();

    return useMutation({
        mutationFn: async (data: { file: File }) => {
            if (!data.file) {
                throw new Error("arquivo é obrigatorio");
            }

            const formData = new FormData();
            formData.append("file", data.file);

            const response = await fetchWithAuth(
                `http://sistemareserva.localhost:8080/api/v1/profile/${user?.id}/photo`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const result = await response.json();
            return result;
        },
        onSuccess: (data) => {
            updateUser(data);

            showAutoDismissAlert({
                message: "Dados salvos com sucesso!",
                description: "Os dados foram atualizados.",
                duration: 2000,
            });  
        }
    });
}