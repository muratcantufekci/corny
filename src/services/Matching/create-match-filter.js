import request from "../request";

export const createMatchFilter = async (data) => {
  const res = await request.post("Matching/CreateMatchFilter", data, {
    withAuth: true,
  });
  return res;
};
