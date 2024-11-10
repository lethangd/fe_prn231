export const addCart = (data) => ({
  type: "ADD_CART",
  data,
});

export const updateCart = (data) => ({
  type: "UPDATE_CART",
  data,
});

export const deleteCart = (data) => ({
  type: "DELETE_CART",
  data,
});

export const deleteAllCart = () => ({
  type: "DELETE_ALL_CART",
});
