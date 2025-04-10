import request from "../request";

export const getSwipeQuestion = async (userId) => {
  const res = await request.get(
    `/Matching/GetSwipeQuestion?swipedUserId=655${userId}`,
    {
      withAuth: true,
    }
  );
  return res;
};
