import request from "../request";

export const authenticate =  async (data) => {
    const res = await request.post(`/Logon/Authenticate`, data)
    return res;
}