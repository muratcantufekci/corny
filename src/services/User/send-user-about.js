import request from "../request";

export const postUserAbouts =  async (data) => {
    const res = await request.post(`/User/SetUserAbout`, data,  { withAuth: true })
    return res;
}