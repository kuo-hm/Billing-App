import api from "../api";

const getCustomerDatabyId = async (id) => {
  const response = await api.get(`auth/customer/data/${id}`);
  return response.data;
};

export default getCustomerDatabyId;
