import request from "../request";

export const getUserAbouts = async () => {
  const res = await request.get(`/User/GetUserAbouts`, {
    withAuth: true,
  });
  return res;
};
