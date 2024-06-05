import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create();

const setHeader = (config, access_token = Cookies.get("access_token")) => {
  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
  }
};

instance.interceptors.request.use(
  (config) => {
    setHeader(config);
    return config;
  },
  (error) => Promise.reject(error)
);

export { setHeader };
export default instance;
