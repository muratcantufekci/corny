import request from "../request";

export const getPotentialMatches = async (page) => {
  const res = await request.get(`/Matching/GetPotentialMatches?PageNumber=${page}&PageSize=10`, {
    withAuth: true,
  });
  return res;
};