import request from "./request";

export const postVerifyCode =  async (data) => {
    const res = await request.post(`/Logon/VerifyCode`, data)
    return res;
}