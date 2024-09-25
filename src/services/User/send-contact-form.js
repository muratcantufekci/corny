import request from "../request";

export const postContactForm =  async (data) => {
    const res = await request.post(`/User/SendContactForm`, data, { withAuth: true })
    return res;
}