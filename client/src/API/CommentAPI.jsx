import axiosClient from "./axiosClient";

const CommentAPI = {
  getCommentProduct: (query) => {
    const url = `/comments/product/${query}`; // Chưa có API comments/product/{productId}
    return axiosClient.get(url);
  },

  postCommentProduct: (query) => {
    const url = `/comments/send${query}`; // Chưa có API comments/send
    return axiosClient.post(url);
  },
};

export default CommentAPI;
