import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { profileRequest } from "../types/profile/profileRequest";
import { useAuth } from "@/contexts/AuthContext";
import type { userResponse } from "../types/profile/userResponse";

export function UseProfile() {
    const queryClient = useQueryClient();
    const {user, token, updateUser} = useAuth();

    console.log(user);

    return useMutation({
        mutationFn: async (data: profileRequest) => {
            if (!data?.name) {
                throw new Error("nome é obrigatorio");
            }
            if (!data?.email) {
                throw new Error("email é obrigatorio");
            }

            const response = await fetch(
                `http://sistemareserva.localhost:8080/api/v1/profile/${user?.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                }
            );

            const result: userResponse = await response.json();
            return result;
        },
        onSuccess: (data) => 
        {
            updateUser(data);
        },
        onError: () => {
            
        }
    })
}