import axiosClient from "./axiosClient";

const ProductAPI = {
  getAPI: () => {
    const url = "/products";
    return axiosClient.get(url);
  },

  getCategory: (query) => {
    const url = `/products/category${query}`;
    return axiosClient.get(url);
  },

  getDetail: (id) => {
    const url = `/products/${id}`;
    return axiosClient.get(url);
  },

  getPagination: (query) => {
    const url = `/products${query}`;
    return axiosClient.get(url);
  },
  createProduct: (productData) => {
    const url = "/products";
    return axiosClient.post(url, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("tokena")}`,
      },
    });
  },
};

export default ProductAPI;
