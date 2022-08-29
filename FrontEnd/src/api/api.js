import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";
import refreshToken from "./auth/refresh_token";

let token = null;
let refresh = null;

const api = axios.create({
  baseURL: process.env.HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

if (typeof window !== "undefined") {
  // Perform localStorage action
  token = localStorage.getItem("authTokens");
  refresh = localStorage.getItem("x-refresh-token");
}

api.interceptors.request.use(
  async (req) => {
    console.log("interceptors.request.use");
    if (typeof window !== "undefined") {
      // Perform localStorage action
      token = localStorage.getItem("authTokens");
      refresh = localStorage.getItem("x-refresh-token");
    }
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
      const user = jwt_decode(token);

      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
      console.log(dayjs.unix(user.exp).isBefore(dayjs()));
      if (!isExpired) return req;
    }

    console.log("interceptors. expired");
    if (refresh) {
      refreshToken(refresh)
        .then((res) => {
          console.log('at refresh');
          localStorage.setItem("authTokens", res.access);
          localStorage.setItem("x-refresh-token", res.refresh);
          console.log("new token");
          req.headers.Authorization = `Bearer ${res.access}`;
          return req;
        })
        .catch((err) => {
          console.log('at refresh catch');

          localStorage.removeItem("authTokens");
          localStorage.removeItem("x-refresh-token");
          window.location.href = "/login";
          return err;
        });
    }
    if(!refresh){
      window.location.href = "/login";

      return req;}
    return req;
  },
  (error) => {
    console.log("error in interceptor");
    return Promise.reject(error);
  }
);
export default api;
