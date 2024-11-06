import axiosClient from "./axiosClient";

const CartAPI = {
  getCarts: (query) => {
    const url = `/cart${query}`;
    return axiosClient.get(url);
  },

  postAddToCart: (query) => {
    const url = `/cart/add${query}`;
    return axiosClient.post(url);
  },

  deleteToCart: (query) => {
    const url = `/cart/remove${query}`;
    return axiosClient.delete(url);
  },

  putToCart: (query) => {
    const url = `/cart/update${query}`;
    return axiosClient.put(url);
  },

  clearCart: () => {
    const url = "/cart/clear"; // Chưa có API cart/clear
    return axiosClient.delete(url);
  },
};

export default CartAPI;
