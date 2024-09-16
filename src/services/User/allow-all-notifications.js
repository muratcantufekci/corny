import request from "../request";

export const allowAllUserNotifications = async () => {
  const res = await request.get(`/User/AllowAllUserNotificationPreferences`, {
    withAuth: true,
  });
  return res;
};
