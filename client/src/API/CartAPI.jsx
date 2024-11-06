// api/CartAPI.js
import axiosClient from "./axiosClient";

const CartAPI = {
  // Get cart data
  getCarts: async () => {
    const url = "/cart";
    return axiosClient.get(url); // Gọi API để lấy giỏ hàng
  },

  // Add product to cart
  addToCart: async (item) => {
    const url = "/cart/add";
    return axiosClient.post(url, item); // Gọi API để thêm sản phẩm
  },

  // Update cart product quantity
  updateCart: async (productId, quantity) => {
    const url = `/cart/update/${productId}`;
    return axiosClient.put(url, { quantity }); // Gọi API để cập nhật số lượng
  },

  // Remove product from cart
  removeFromCart: async (productId) => {
    const url = `/cart/remove/${productId}`;
    return axiosClient.delete(url); // Gọi API để xóa sản phẩm
  },

  // Clear the entire cart
  clearCart: async () => {
    const url = "/cart/clear";
    return axiosClient.delete(url); // Gọi API để xóa giỏ hàng
  },
};

export default CartAPI;
