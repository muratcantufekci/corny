import request from "../request";

export const updateUserPhone = async (phone, indentifierCode) => {
  const res = await request.get(
    `/User/UpdateUserPhoneNumber?phoneNumber=${phone}&identifierCode=${indentifierCode}`,
    { withAuth: true }
  );
  return res;
};
