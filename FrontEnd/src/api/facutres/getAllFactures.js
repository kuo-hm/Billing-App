import api from "../api";

const getFactures = async () => {
  const response = await api.get(`invoices/fetch/facture`);
  return response.data.factures;
};

export default getFactures;
