import { useMutation } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

export function UseProfilePass() {
    const {user} = useAuth();
    const { fetchWithAuth } = useApi();

    return useMutation({
        mutationFn: async (data: {password: string, password_old: string}) => {
            if (!data?.password) {
                throw new Error("senha nova é obrigatoria");
            }

            if (!data?.password_old) {
                throw new Error("senha atual é obrigatoria");
            }

            const response = await fetchWithAuth(
                `${environment.apiUrl}/${environment.apiVersion}/profile/${user?.id}/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
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