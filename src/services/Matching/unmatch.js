import request from "../request";

export const unMatch = async (id) => {
  const res = await request.get(
    `/Matching/UnMatch?otherUserConnectionId=${id}`,
    {
      withAuth: true,
    }
  );
  return res;
};
