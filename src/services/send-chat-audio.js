import request from "./request";

export const postChatAudio =  async (sender, receiver, data) => {
    const res = await request.post(`/Chat/UploadChatAudio?sender=${sender}&receiver=${receiver}`, data, { withAuth: true })
    return res;
}