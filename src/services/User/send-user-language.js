import request from "../request";

export const postUserLanguagePreferences = async (language) => {
  const res = await request.get(`/User/UpdateUserLanguage?lang=${language}`, {
    withAuth: true,
  });
  return res;
};
