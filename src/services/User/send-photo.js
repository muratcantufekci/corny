import request from "../request";

export const postUserPhoto = async (data) => {
  const config = {
    withAuth: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
  const res = await request.post(`/User/UploadProfileImage`, data, config);
  return res;
};
