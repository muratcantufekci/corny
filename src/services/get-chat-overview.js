import request from "./request";

export const getChatOverview = async () => {
  const res = await request.get(`/Chat/GetChatOverview`, {
    withAuth: true,
  });
  return res;
};
