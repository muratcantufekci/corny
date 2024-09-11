import request from "../request";

export const getAccountDetails = async () => {
  const res = await request.get(`/User/GetAccountDetails`, {
    withAuth: true,
  });
  return res;
};
