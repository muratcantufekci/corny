import request from "./request";

export const postUserLocation =  async (data) => {
    const res = await request.post(`/User/InsertUserLocation`, data)
    return res;
}