import axios from "axios";
import useUserStore from "../store/useUserStore";
// const getBaseHeaders = (headers) => {
//   return {
//     ...headers
//   };
// };

class Request {
  constructor(apiUrl) {
    this.instance = axios.create({
      headers: {
        // ...getBaseHeaders(),
      },
      baseURL: apiUrl,
    });
  }

  get = async (dest, config = {}) => {
    if (config.withAuth) {
      const token = useUserStore.getState().token;
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const { data } = await this.instance.get(dest, config);
    return data;
  };

  post = async (dest, body = {}, config = {}) => {
    if (config.withAuth) {
      const token = useUserStore.getState().token;
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const { data } = await this.instance.post(dest, body, config);
    return data;
  };
}

const apiUrl = "https://tvmatching.azurewebsites.net/api";

const request = new Request(apiUrl);

export default request;
