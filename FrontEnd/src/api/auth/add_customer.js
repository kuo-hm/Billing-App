import api from "../api";

const addCustomer = async (data) => {
  const response = await api.post("/login/auth/register", data);
  return response.data;
};
export default addCustomer;
