import request from "./request";

export const postEmail = async (data) => {
  const res = await request.get(`/User/SetEmail?email=${data}`, {
    withAuth: true,
  });
  return res;
};
