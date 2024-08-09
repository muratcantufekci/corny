import request from "./request";

export const postUserMovies = async (data) => {
  const res = await request.post(`/TvShow/SelectTvShows`, data, {
    withAuth: true,
  });
  return res;
};
