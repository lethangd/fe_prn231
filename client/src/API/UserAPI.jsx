import axiosClient from "./axiosClient";

const UserAPI = {
  // Lấy tất cả dữ liệu người dùng
  getAllData: () => {
    const url = "/users";
    return axiosClient.get(url);
  },

  // Lấy chi tiết dữ liệu người dùng theo ID
  getDetailData: (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },

  // Đăng ký người dùng mới
  postSignUp: (data) => {
    const url = "/auth/register";
    return axiosClient.post(url, data);
  },

  // Đăng nhập người dùng
  postLogin: (data) => {
    const url = "/auth/login";
    return axiosClient.post(url, data);
  },

  // Lấy thông tin profile của người dùng
  getProfileData: () => {
    const url = "/customers/profile"; // Chưa có API profile
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  // Lấy danh sách đơn hàng của người dùng
  getOrders: () => {
    const url = "/customers/orders"; // Chưa có API orders
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  // Lấy chi tiết đơn hàng của người dùng theo ID đơn hàng
  getOrderDetail: (orderId) => {
    const url = `/customers/orders/${orderId}`; // Chưa có API orders/{orderId}
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};

export default UserAPI;
