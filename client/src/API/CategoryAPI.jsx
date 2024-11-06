const CategoryAPI = {
  // Lấy danh sách tất cả categories
  getCategories: async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json(); // Giả sử response trả về dữ liệu ở dạng JSON
      return data; // Dữ liệu trả về sẽ là mảng các category
    } catch (error) {
      console.error("Error fetching categories:", error);
      return []; // Trả về mảng rỗng nếu có lỗi
    }
  },
};

export default CategoryAPI;
