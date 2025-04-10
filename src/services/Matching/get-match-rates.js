import request from "../request";

export const getMatchRates = async (data) => {
  const res = await request.post("Matching/GetMatchRates", data, {
    withAuth: true,
  });
  return res;
};
