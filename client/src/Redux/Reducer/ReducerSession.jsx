// reducers/ReducerSession.js
const initialState = {
  token: localStorage.getItem("accessToken") || "",
};

const ReducerSession = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_SESSION":
      // Save token to localStorage
      localStorage.setItem("accessToken", action.data);
      return {
        ...state,
        token: action.data,
      };

    case "DELETE_SESSION":
      // Clear token from localStorage
      localStorage.removeItem("accessToken");
      return {
        ...state,
        token: "",
      };

    default:
      return state;
  }
};

export default ReducerSession;
