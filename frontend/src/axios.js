import axios from "axios";
import Cookie from "js-cookie";

const instance = axios.create();

const accessToken = Cookie.get("access_token");

if (accessToken) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export default instance;
