import request from "../request";

export const updateUserPhone = async (data) => {
  const res = await request.post(`/User/UpdateUserPhoneNumber`, data, {
    withAuth: true,
  });
  return res;
};
