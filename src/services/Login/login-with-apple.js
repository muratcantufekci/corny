import request from "../request";

export const authenticateWithApple = async (data) => {
  const res = await request.post(`/Logon/AuthenticateWithApple`, data);
  return res;
};
