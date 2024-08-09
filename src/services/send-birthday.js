import request from "./request";

export const postBirthday = async (day, month, year) => {
  const res = await request.get(`/User/SetBirthday?year=${year}&month=${month}&day=${day}`, {
    withAuth: true,
  });
  return res;
};
