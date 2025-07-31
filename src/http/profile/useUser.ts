import { useQuery } from "@tanstack/react-query";
import type { profileRequest } from "../types/profile/profileRequest";

export function useUser() {
  return useQuery({
    queryKey: ["get-user"],
    queryFn: async () => {
      const response = await fetch("http:///localhost:3333/rooms");
      const result: profileRequest = await response.json();

      return result;
    },
  });
}
