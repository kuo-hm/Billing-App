import api from "../api";

const getDevisById = async (id) => {
  const response = await api.get(`invoices/fetch/devi/${id}`);
  console.log(response.data);
  return response.data.devis;
};

export default getDevisById;
