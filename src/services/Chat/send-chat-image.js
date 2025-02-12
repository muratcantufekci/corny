import request from "../request";

export const postChatImage = async (sender, receiver, data) => {
  const res = await request.post(
    `/Chat/UploadChatImage?sender=${sender}&receiver=${receiver}`,
    data,
    {
      withAuth: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res;
};
