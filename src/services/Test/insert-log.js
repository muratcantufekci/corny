import request from "../request";

export const postLog = async (data) => {
  const res = await request.post(`/Test/InsertLog`, data);
  return res;
};
