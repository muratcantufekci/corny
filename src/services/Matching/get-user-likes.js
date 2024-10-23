import request from "../request";

export const getUserLikes = async (page) => {
  const res = await request.get(
    `/Matching/GetUserLikes?page=${page}&limit=50`,
    {
      withAuth: true,
    }
  );
  return res;
};
