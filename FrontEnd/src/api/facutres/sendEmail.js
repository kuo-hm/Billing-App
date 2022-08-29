import api from "../api";

const sendEmail = async (data) => {
  const response = await api.post(`invoices/send/facture-email`, data);
  return response.data.facture;
};

export default sendEmail;
