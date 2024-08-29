import request from "../request";

export const postUsername =  async (data) => {
    const res = await request.get(`/User/SetName?name=${data}`, { withAuth: true })
    return res;
}