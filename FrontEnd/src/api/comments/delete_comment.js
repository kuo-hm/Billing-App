import api from "../api";

const deleteCommentbyId = async (id) => {
  const response = await api.delete(`auth/delete_comment/${id}`);
  return response.data;
};

export default deleteCommentbyId;
