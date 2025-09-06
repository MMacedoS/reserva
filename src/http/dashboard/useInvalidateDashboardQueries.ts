import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateDashboardQueries() {
  const queryClient = useQueryClient();

  const invalidateCheckinToday = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard-checkin-today"] });

  const invalidateApartments = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard-apartments"] });

  const invalidateCheckoutToday = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard-checkout-today"] });

  const invalidateGuests = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard-guests"] });

  const invalidateDailyRevenue = (start: string, end: string) =>
    queryClient.invalidateQueries({
      queryKey: ["dashboard-daily-revenue", start, end],
    });

  return {
    invalidateCheckinToday,
    invalidateApartments,
    invalidateCheckoutToday,
    invalidateGuests,
    invalidateDailyRevenue,
  };
}
