import api from "../api";

const editFactures = async (data) => {
  const response = await api.put(`invoices/edit/facture`, data);
  return response.data;
};

export default editFactures;
