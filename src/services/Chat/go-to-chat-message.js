import request from "../request";

export const goToChatMessage = async (chatRoomId, messageIdentifier) => {
  const res = await request.get(
    `/Chat/GotoChatMessage?chatRoomId=${chatRoomId}&messageIdentifier=${messageIdentifier}`,
    {
      withAuth: true,
    }
  );
  return res;
};
