// reducers/ReducerCart.js
const initialState = {
  listCart: JSON.parse(localStorage.getItem("listCart")) || [],
};

const ReducerCart = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_CART":
      const newCartItem = action.data;
      const updatedCart = [...state.listCart];

      // Check if product already exists in the cart
      const itemIndex = updatedCart.findIndex(
        (item) => item.idProduct === newCartItem.idProduct
      );

      if (itemIndex !== -1) {
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          count: updatedCart[itemIndex].count + newCartItem.count,
        };
      } else {
        updatedCart.push(newCartItem);
      }

      localStorage.setItem("listCart", JSON.stringify(updatedCart));
      return {
        ...state,
        listCart: updatedCart,
      };

    case "DELETE_CART":
      const filteredCart = state.listCart.filter(
        (item) => item.idProduct !== action.data.idProduct
      );

      localStorage.setItem("listCart", JSON.stringify(filteredCart));
      return {
        ...state,
        listCart: filteredCart,
      };

    case "DELETE_ALL_CART":
      localStorage.removeItem("listCart");
      return {
        ...state,
        listCart: [],
      };

    case "UPDATE_CART":
      const updatedCartList = state.listCart.map((item) =>
        item.idProduct === action.data.idProduct
          ? { ...item, count: action.data.count }
          : item
      );

      localStorage.setItem("listCart", JSON.stringify(updatedCartList));
      return {
        ...state,
        listCart: updatedCartList,
      };

    default:
      return state;
  }
};

export default ReducerCart;
