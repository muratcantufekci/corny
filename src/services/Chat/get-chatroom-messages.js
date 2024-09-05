import request from "../request";

export const getChatroomMessages= async (
  chatRoomId,
  lastMessageIdentifier,
) => {
  const res = await request.get(
    `/Chat/GetChatRoomMessages?chatRoomId=${chatRoomId}&lastMessageIdentifier=${lastMessageIdentifier}&limit=50`,
    {
      withAuth: true,
    }
  );
  return res;
};
