import api from "../api";

const pdfDownload = async (data) => {
  const response = await api.get(`invoices/fetch/facture/pdf/${data}`);
  return response.data.facture;
};

export default pdfDownload;
