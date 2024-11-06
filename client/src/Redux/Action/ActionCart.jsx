// Action để thêm sản phẩm vào giỏ hàng
export const addCart = (data) => {
  return {
    type: "ADD_CART",
    data, // Giữ nguyên action thêm sản phẩm vào giỏ hàng
  };
};

// Action để cập nhật sản phẩm trong giỏ hàng
export const updateCart = (data) => {
  return {
    type: "UPDATE_CART",
    data, // Giữ nguyên action cập nhật giỏ hàng
  };
};

// Action để xóa sản phẩm khỏi giỏ hàng
export const deleteCart = (data) => {
  return {
    type: "DELETE_CART",
    data, // Giữ nguyên action xóa sản phẩm khỏi giỏ hàng
  };
};
