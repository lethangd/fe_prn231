import axiosClient from "./axiosClient";

const CheckoutAPI = {
  createOrder: async (orderData) => {
    const url = "/orders"; // API tạo đơn hàng
    return axiosClient.post(url, orderData); // Gửi dữ liệu đơn hàng lên server
  },
  postEmail: (query) => {
    const url = `/email${query}`; // API gửi email xác nhận
    return axiosClient.post(url);
  },
};

export default CheckoutAPI;
