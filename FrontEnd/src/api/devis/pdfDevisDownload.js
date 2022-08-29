import api from "../api";

const pdfDevisDownload = async (data) => {
  const response = await api.get(`invoices/fetch/devis/pdf/${data}`);
  return response.data.facture;
};

export default pdfDevisDownload;
