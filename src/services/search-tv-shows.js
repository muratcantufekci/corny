import request from "./request";

export const searchTvShowsByText = async (text) => {
  const res = await request.get(`/TvShow/SearchTvShow?searchTerm=${text}`);
  return res;
};
