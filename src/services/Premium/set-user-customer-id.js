import request from "../request";

export const setUserCustomerId = async (data) => {
  const res = await request.post("Premium/SetUserCustomerId", data, {
    withAuth: true,
  });
  
  return res;
};
