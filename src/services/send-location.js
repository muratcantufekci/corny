import request from "./request";

export const postUserLocation =  async (data) => {
    const res = await request.post(`/User/InsertUserLocation`, data, { withAuth: true })
    return res;
}