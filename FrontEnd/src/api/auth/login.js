import axios from "axios";

const api = axios.create({
  baseURL: process.env.HOST,
  headers: {
    "Content-Type": "application/json",
  },
});
const login = async (email, password) => {
  const response = await api.post("auth/token", {
    email,
    password,
  });
  return response.data;
};

export default login;
