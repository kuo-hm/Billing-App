import api from "../api";

const getCustomerbyId = async (id) => {
  const response = await api.get(`auth/customer/${id}`);
  return response.data;
};

export default getCustomerbyId;
