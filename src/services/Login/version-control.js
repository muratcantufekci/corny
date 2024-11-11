import request from "../request";

export const versionControl = async (os, versiyon) => {
  const res = await request.get(
    `/Logon/VersionControl?osName=${os}&appVersion=${versiyon}`
  );
  return res;
};
