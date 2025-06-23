import request from "../request";

export const purchasePremium = async (data) => {
  const res = await request.post("/Premium/PurchasePremium", data, {
    withAuth: true,
  });

  return res;
};
