import request from "../request";

export const checkUserConfiguration = async () => {
  const res = await request.get(`/User/CheckUserConfiguration`, {
    withAuth: true,
  });
  return res;
};
