const initialState = {
  token: "",
};

const ReducerSession = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SESSION":
      console.log("Token: ", action.data);

      // Lưu token vào state
      return {
        ...state,
        token: action.data,
      };

    case "DELETE_SESSION":
      console.log("Token: ", action.data);

      // Xóa token khi người dùng đăng xuất
      return {
        ...state,
        token: "", // Đặt lại token thành chuỗi rỗng
      };

    default:
      return state;
  }
};

export default ReducerSession;
