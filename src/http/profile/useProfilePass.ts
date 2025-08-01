import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchWithAuth } from "@/hooks/fetchWithAuth";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export function UseProfilePass() {
    const {user} = useAuth();

    const { fetchWithAuth } = useFetchWithAuth();

    return useMutation({
        mutationFn: async (data: {password: string, password_old: string}) => {
            if (!data?.password) {
                throw new Error("senha nova é obrigatoria");
            }

            if (!data?.password_old) {
                throw new Error("senha atual é obrigatoria");
            }

            const response = await fetchWithAuth(
                `http://sistemareserva.localhost:8080/api/v1/profile/${user?.id}/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();
            return result;
        },
        onSuccess: (res: {status:number, data: any}) => {
            showAutoDismissAlert({
                message: "Dados salvos com sucesso!",
                description: "Os dados foram atualizados.",
                duration: 2000,
            });  
        }
    })
}