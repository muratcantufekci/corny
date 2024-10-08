import request from "../request";

export const getUserAboutsById = async (userId) => {
  const res = await request.get(`/Matching/GetUserAbouts?userId=${userId}`, {
    withAuth: true,
  });
  return res;
};
