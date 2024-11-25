import request from "../request";

export const getPotentialMatches = async (page, data) => {
  const res = await request.post(
    `/Matching/GetPotentialMatches?PageNumber=${page}&PageSize=20`,
    data,
    {
      withAuth: true,
    }
  );
  return res;
};
