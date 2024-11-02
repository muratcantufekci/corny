import request from "../request";

export const getSinglePotentialMatch = async (userId) => {
  const res = await request.get(`/Matching/GetSinglePotentialMatch?userId=${userId}`, {
    withAuth: true,
  });
  return res;
};