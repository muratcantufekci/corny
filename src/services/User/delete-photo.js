import request from "../request";

export const deleteUserPhoto =  async (data) => {
    const res = await request.get(`/User/DeleteProfileImage?imageId=${data}`, { withAuth: true })
    return res;
}