import axios from "axios";

const api = axios.create({
  baseURL: process.env.HOST,
  headers: {
    "Content-Type": "application/json",
  },
});
const refreshToken = async (refresh) => {
  const response = await api.post("auth/token/refresh", {
    refresh: refresh,
  });

  return response.data;
};

export default refreshToken;
