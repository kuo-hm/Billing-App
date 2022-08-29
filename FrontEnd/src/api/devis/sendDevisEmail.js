import api from "../api";

const sendDevisEmail = async (data) => {
  const response = await api.post(`invoices/send/devis-email`, data);
  return response.data.facture;
};

export default sendDevisEmail;
