import api from "../api";

const getCustomers = async () => {
  const response = await api.get("auth/customers");
  return response.data;
};

export default getCustomers;
