import request from "./request";

export const postUserPhotoOrder =  async (data) => {
    const res = await request.post(`/User/UpdateProfileImageOrders`, data,  { withAuth: true })
    return res;
}