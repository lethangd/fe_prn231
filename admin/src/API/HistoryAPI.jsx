import axiosClient from "./axiosClient";

const HistoryAPI = {
  getHistoryAPI: (query) => {
    const url = `/orders`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokena")}`,
      },
    });
  },

  getDetail: (id) => {
    const url = `/orders/${id}`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokena")}`,
      },
    });
  },

  getAll: () => {
    const url = `/orders`;
    return axiosClient.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokena")}`,
      },
    });
  },
};

export default HistoryAPI;
