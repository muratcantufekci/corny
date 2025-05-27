import request from "../request";

export const exploreProfiles = async (data) => {
  const res = await request.post(`/Matching/Explore`, data, {
    withAuth: true,
  });
  
  return res;
};
