import request from "./request";

export const authenticateWithRefreshToken =  async (data) => {
    const res = await request.post(`/Logon/AuthenticateRefreshToken`, data)
    return res;
}