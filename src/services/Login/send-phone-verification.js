import request from "../request";

export const postPhoneVerification =  async (data) => {
    const res = await request.post(`/Logon/SendPhoneVerificationCode`, data)
    return res;
}