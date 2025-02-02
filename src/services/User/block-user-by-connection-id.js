import request from "../request";

export const blockUserByConnectionId = async (id) => {
  const res = await request.get(
    `/User/BlockUserByConnectionId?otherUserConnectionId=${id}`,
    {
      withAuth: true,
    }
  );
  return res;
};
