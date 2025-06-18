import request from "../request";

export const useConsumable = async (data) => {
  const res = await request.post("Consumable/UseConsumable", data, {
    withAuth: true,
  });
  return res;
};
