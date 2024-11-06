import axiosClient from "./axiosClient";

const ProductAPI = {
  // Lấy tất cả sản phẩm với phân trang, sắp xếp và tìm kiếm
  getAPI: (queryParams) => {
    const url = "/products"; // Endpoint này đã được cập nhật
    return axiosClient.get(url, { params: queryParams });
  },

  // Lấy sản phẩm theo danh mục (category)
  getCategory: (categoryId) => {
    const url = `/products/category/${categoryId}`; // Giả sử API này tồn tại
    return axiosClient.get(url);
  },

  // Lấy chi tiết sản phẩm theo ID
  getDetail: (id) => {
    const url = `/products/${id}`; // Đúng với endpoint API chi tiết sản phẩm
    return axiosClient.get(url);
  },

  // Lấy sản phẩm bán chạy
  getBestSelling: () => {
    const url = "/products/best-selling"; // Đúng với endpoint
    return axiosClient.get(url);
  },

  // Lấy sản phẩm mới
  getNew: () => {
    const url = "/products/new"; // Đúng với endpoint
    return axiosClient.get(url);
  },

  // Lấy sản phẩm giảm giá
  getSale: () => {
    const url = "/products/sale"; // Đúng với endpoint
    return axiosClient.get(url);
  },

  // Xuất sản phẩm ra file Excel
  postExport: () => {
    const url = "/products/export"; // Đúng với endpoint
    return axiosClient.post(url);
  },

  // Nhập sản phẩm từ file Excel
  postImport: (data) => {
    const url = "/products/import"; // Đúng với endpoint
    return axiosClient.post(url, data);
  },

  // Phương thức này có thể được sử dụng để thêm sản phẩm mới nếu có API tương ứng
  createProduct: (data) => {
    const url = "/products"; // Endpoint thêm sản phẩm
    return axiosClient.post(url, data);
  },

  // Phương thức này có thể được sử dụng để cập nhật sản phẩm
  updateProduct: (id, data) => {
    const url = `/products/${id}`; // Endpoint sửa sản phẩm
    return axiosClient.put(url, data);
  },

  // Phương thức này có thể được sử dụng để xóa sản phẩm
  deleteProduct: (id) => {
    const url = `/products/${id}`; // Endpoint xóa sản phẩm
    return axiosClient.delete(url);
  },
};

export default ProductAPI;
