import axios from "axios";
import Cookie from "js-cookie";

const instance = axios.create();

const accessToken = Cookie.get("access_token");
console.log("access_token: ", accessToken);

if (accessToken) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export default instance;
