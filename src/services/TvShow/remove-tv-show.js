import request from "../request";

export const removeUserTvShow = async (id) => {
  const res = await request.get(`/TvShow/RemoveUserTvShow?tvShowId=${id}`, {
    withAuth: true,
  });
  return res;
};
