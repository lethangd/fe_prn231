const initialState = {
  token: "",
  listCart: JSON.parse(localStorage.getItem("listCart")) || [], // Lấy giỏ hàng từ localStorage (nếu có)
};

const ReducerCart = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TOKEN":
      console.log("Token: ", action.data);
      state = {
        ...state,
        token: action.data, // Lưu token vào state
      };
      return state;

    case "ADD_CART":
      console.log(action.data);

      const data_add_cart = action.data;
      const add_cart = [...state.listCart]; // Copy giỏ hàng hiện tại để tránh trực tiếp thay đổi state

      if (add_cart.length < 1) {
        add_cart.push(data_add_cart);
      } else {
        // Tìm vị trí của sản phẩm đã mua
        const indexCart = add_cart.findIndex(
          (value) => value.idProduct === data_add_cart.idProduct
        );

        if (indexCart === -1) {
          add_cart.push(data_add_cart);
          console.log("Push");
        } else {
          add_cart[indexCart].count =
            parseInt(add_cart[indexCart].count) + parseInt(data_add_cart.count);
          console.log("Update");
        }
      }

      // Cập nhật lại state và lưu vào localStorage
      localStorage.setItem("listCart", JSON.stringify(add_cart)); // Lưu giỏ hàng vào localStorage

      state = {
        ...state,
        listCart: add_cart,
      };

      console.log(state);
      return state;

    case "DELETE_CART":
      const data_delete_cart = action.data;
      const delete_cart = [...state.listCart]; // Copy giỏ hàng hiện tại

      const indexDelete = delete_cart.findIndex(
        (value) => value.idProduct === data_delete_cart.idProduct
      );
      if (indexDelete !== -1) {
        delete_cart.splice(indexDelete, 1);
      }

      // Cập nhật lại state và lưu vào localStorage
      localStorage.setItem("listCart", JSON.stringify(delete_cart)); // Lưu giỏ hàng vào localStorage

      state = {
        ...state,
        listCart: delete_cart,
      };
      return state;

    case "DELETE_ALL_CART":
      // Xóa giỏ hàng
      localStorage.removeItem("listCart"); // Xóa giỏ hàng khỏi localStorage
      state = {
        ...state,
        listCart: [], // Xóa toàn bộ giỏ hàng trong state
      };
      return state;

    case "UPDATE_CART":
      const data_update_cart = action.data;
      const update_cart = [...state.listCart]; // Copy giỏ hàng hiện tại

      const indexUpdate = update_cart.findIndex(
        (value) => value.idProduct === data_update_cart.idProduct
      );
      if (indexUpdate !== -1) {
        update_cart[indexUpdate].count = data_update_cart.count;
      }

      // Cập nhật lại state và lưu vào localStorage
      localStorage.setItem("listCart", JSON.stringify(update_cart)); // Lưu giỏ hàng vào localStorage

      state = {
        ...state,
        listCart: update_cart,
      };
      return state;

    default:
      return state;
  }
};

export default ReducerCart;
