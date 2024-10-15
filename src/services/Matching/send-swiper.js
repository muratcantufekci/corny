import request from "../request";

export const postSwipe = async (data) => {
  const res = await request.post(`/Matching/Swipe`, data, { withAuth: true });
  return res;
};
