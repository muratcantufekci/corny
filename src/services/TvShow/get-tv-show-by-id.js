import request from "../request";

export const getTvShowById = async (id) => {
  const res = await request.get(`/TvShow/GetTvShowById?tvShowId=${id}`, {
    withAuth: true,
  });
  return res;
};
