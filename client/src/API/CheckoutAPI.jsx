import axiosClient from "./axiosClient";

const CheckoutAPI = {
  postEmail: (query) => {
    const url = `/email${query}`; // Chưa có API email
    return axiosClient.post(url);
  },
};

export default CheckoutAPI;
