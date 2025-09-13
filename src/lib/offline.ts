import localforage from "localforage";

export const saveReservationsOffline = async (reservations: any[]) => {
  await localforage.setItem("reservations", reservations);
};

export const getReservationsOffline = async (): Promise<any[]> => {
  const data = await localforage.getItem("reservations");
  return Array.isArray(data) ? data : [];
};

export const addReservationOffline = async (reservation: any) => {
  const current = await getReservationsOffline();
  await saveReservationsOffline([...current, reservation]);
};

export const clearReservationsOffline = async () => {
  await localforage.removeItem("reservations");
};
