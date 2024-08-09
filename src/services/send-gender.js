import request from "./request";

export const postGender = async (data) => {
  const res = await request.get(`/User/SetGender?gender=${data}`, {
    withAuth: true,
  });
  return res;
};
