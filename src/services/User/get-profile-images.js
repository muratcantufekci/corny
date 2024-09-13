import request from "../request";

export const getProfileImages = async () => {
  const res = await request.get(`/User/GetProfileImages`, {
    withAuth: true,
  });
  return res;
};