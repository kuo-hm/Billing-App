import api from "../api";

const addAdmin = async (data) => {
  const response = await api.post("/login/auth/register", data);
  return response.data;
};
export default addAdmin;
