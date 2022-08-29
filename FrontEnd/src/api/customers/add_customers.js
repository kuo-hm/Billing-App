import api from "../api";

const addCustomers = async (data) => {
  const response = await api.post("auth/register_customer", data);
  return response.data;
};

export default addCustomers;
