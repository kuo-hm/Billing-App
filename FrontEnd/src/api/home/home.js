import api from "../api";

const fetchHome = async (email, password) => {
  const response = await api.get("invoices/fetch/home", {
    email,
    password,
  });
  return response.data;
};

export default fetchHome;
