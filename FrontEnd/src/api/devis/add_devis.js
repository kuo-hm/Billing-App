import api from "../api";

const addDevis = async (data) => {
  const response = await api.post(`invoices/add/devi`, data);
  return response.data.factures;
};

export default addDevis;
