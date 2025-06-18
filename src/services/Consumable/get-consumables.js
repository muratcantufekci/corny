import request from "../request";

export const getConsumables = async () => {
  const res = await request.get(`/Consumable/GetConsumables`, {
    withAuth: true,
  });
  return res;
};
