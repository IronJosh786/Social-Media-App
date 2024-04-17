import axios from "axios";
import Cookie from "js-cookie";

const instance = axios.create();

const setHeader = (access_token) => {
  const accessToken = Cookie.get("access_token") || access_token;
  if (accessToken) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

export { setHeader };

export default instance;
