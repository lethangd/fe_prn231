import axiosClient from "./axiosClient";

const UserAPI = {
  getAllData: () => {
    const url = "/Admin/customers";
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokena")}`,
      },
    });
  },

  getDetailData: (id) => {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  postLogin: (data) => {
    const url = "/auth/login";
    return axiosClient.post(url, data);
  },

  postSignUp: (query) => {
    const url = `/users/signup/${query}`;
    return axiosClient.post(url);
  },
};

export default UserAPI;
