import api from "../api";

const getFacturesById = async (id) => {
  const response = await api.get(`invoices/fetch/facture/${id}`);
  return response.data.facture;
};

export default getFacturesById;
