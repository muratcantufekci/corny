import request from "../request";

export const getTvShowsByPopularity =  async (page) => {
    const res = await request.get(`/TvShow/GetTvShowsByPopularity?page=${page}&limit=18`)
    return res;
}