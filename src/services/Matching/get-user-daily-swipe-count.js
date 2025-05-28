import request from "../request";

export const getUserSwipeCount = async () => {
  const res = await request.get(`/Matching/GetUserDailySwipeCount`, {
    withAuth: true,
  });
  return res;
};
