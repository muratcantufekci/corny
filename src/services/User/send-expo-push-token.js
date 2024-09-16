import request from "../request";

export const postExpoPushToken =  async (data) => {
    const res = await request.post(`/User/SetExpoPushToken`, data, { withAuth: true })
    return res;
}