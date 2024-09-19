import request from "../request";

export const getUserNotificationPreferences = async () => {
  const res = await request.get(`/User/GetUserNotificationPreferences`, {
    withAuth: true,
  });
  return res;
};
