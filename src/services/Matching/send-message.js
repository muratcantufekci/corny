import request from "../request";

export const postSwipeMessage = async (data) => {
  const res = await request.post(`/Matching/SendSwipeMessage`, data, { withAuth: true });
  return res;
};
