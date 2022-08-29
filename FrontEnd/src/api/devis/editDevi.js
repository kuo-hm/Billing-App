import api from "../api";

const editDevis = async (data) => {
  const response = await api.put(`invoices/edit/devi`, data);
  return response.data;
};

export default editDevis;
