import addAdmin from "./auth/add_admin";
import addCustomer from "./auth/add_customer";
import login from "./auth/login";
import refreshToken from "./auth/refresh_token";
import deleteCommentbyId from "./comments/delete_comment";
import addCustomers from "./customers/add_customers";
import getCustomerbyId from "./customers/customer_by_id";
import getCustomerDatabyId from "./customers/customer_data_by_id";
import getCustomers from "./customers/get_all_customer";
import addDevis from "./devis/add_devis";
import getDevisById from "./devis/getDevisById";
import getDevis from "./devis/get_all_devis";
import addFactures from "./facutres/addFacture";
import editFactures from "./facutres/editFacture";
import getFactures from "./facutres/getAllFactures";
import getFacturesById from "./facutres/getFactureById";
import fetchHome from "./home/home";
export {
  login,
  addAdmin,
  addCustomer,
  refreshToken,
  fetchHome,
  getCustomers,
  getCustomerbyId,
  deleteCommentbyId,
  getFactures,
  addFactures,
  addCustomers,
  getDevis,
  addDevis,
  getFacturesById,
  editFactures,
  getDevisById,
  getCustomerDatabyId,
};
