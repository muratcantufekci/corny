import request from "../request";

export const getUserRecievedLikes = async (page) => {
  const res = await request.get(`/Matching/GetUserReceivedLikes?page=${page}&limit=100`, {
    withAuth: true,
  });
  return res;
};
