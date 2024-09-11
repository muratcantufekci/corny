import request from "../request";

export const getUserTvShows = async () => {
  const res = await request.get(`/TvShow/GetUserTvShows`, {
    withAuth: true,
  });
  return res;
};
