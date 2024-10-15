import request from "../request";

export const getUserTvShowsById = async (id, page) => {
  const res = await request.get(
    `/Matching/GetUserTvShows?userId=${id}&page=${page}&limit=50`,
    {
      withAuth: true,
    }
  );
  return res;
};
