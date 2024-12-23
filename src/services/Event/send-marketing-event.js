import request from "../request";

export const postMarketingEvents= async (data, auth = true) => {
  const res = await request.post(`/Event/SendMarketingEvent`, data, { withAuth: auth });
  return res;
};
