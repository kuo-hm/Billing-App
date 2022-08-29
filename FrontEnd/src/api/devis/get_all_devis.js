import api from "../api";

const getDevis = async () => {
  const response = await api.get(`invoices/fetch/devi`);
  return response.data;
};

export default getDevis;
