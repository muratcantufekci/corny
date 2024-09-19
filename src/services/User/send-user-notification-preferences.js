import request from "../request";

export const postUserNotificationPreferences = async (type, isAllowed) => {
  const res = await request.get(
    `/User/SetUserNotificationPreference?notificationType=${type}&isAllowed=${isAllowed}`,
    { withAuth: true }
  );
  return res;
};
