import request from "../request";

export const postReportForm =  async (data) => {
    const res = await request.post(`/User/SendReportForm`, data, { withAuth: true })
    return res;
}