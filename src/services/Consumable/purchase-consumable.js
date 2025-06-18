import request from "../request";

export const purchaseConsumable = async (data) => {
  const res = await request.post("Consumable/PurchaseConsumable", data, {
    withAuth: true,
  });
  return res;
};
