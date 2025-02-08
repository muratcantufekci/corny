import request from "../request";

export const authenticateWithGoogle = async (data) => {
  const res = await request.post(`/Logon/AuthenticateWithGoogle`, data);
  return res;
};
