import api from "../api";

const addFactures = async (data) => {
  const response = await api.post(`invoices/add/facture`, data);
  return response.data.factures;
};

export default addFactures;
