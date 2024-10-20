import request from "../request";

export const addUserTvShow = async (id) => {
  const res = await request.get(`/TvShow/SelectTvShow?tvShowId=${id}`, {
    withAuth: true,
  });
  return res;
};
