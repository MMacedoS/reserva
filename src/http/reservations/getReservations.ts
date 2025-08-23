import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Reservation } from "@/http/types/reservations/Reservation";

type GetReservationsParams = {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  type?: string;
};

export function useGetReservations({
  page = 1,
  limit = 10,
  search = "",
  startDate = "",
  endDate = "",
  status = "",
  type = "",
}: GetReservationsParams) {
  const { fetchWithAuth } = useApi();

  let attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;
  if (search) attr += `&search=${encodeURIComponent(search)}`;
  if (startDate) attr += `&start_date=${encodeURIComponent(startDate)}`;
  if (endDate) attr += `&end_date=${encodeURIComponent(endDate)}`;
  if (status) attr += `&status=${encodeURIComponent(status)}`;
  if (type) attr += `&type=${encodeURIComponent(type)}`;

  return useQuery({
    queryKey: [
      "reservations",
      page,
      limit,
      search,
      startDate,
      endDate,
      status,
      type,
    ],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations?${attr}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar reservas");
      }

      const json = await response.json();
      return {
        data: (json.data.reservations ||
          json.data.items ||
          []) as Reservation[],
        pagination: json.data.pagination,
      };
    },
  });
}
