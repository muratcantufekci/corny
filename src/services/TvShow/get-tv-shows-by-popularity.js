import request from "../request";

export const getTvShowsByPopularity = async (page, priorSelect) => {
  const res = await request.get(
    `/TvShow/GetTvShowsByPopularity?page=${page}&limit=18&priorUserSelected=${priorSelect}`,
    {
      withAuth: true,
    }
  );
  return res;
};
