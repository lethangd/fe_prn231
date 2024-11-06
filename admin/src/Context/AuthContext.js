import { createContext, useEffect, useReducer } from "react";

const INITIAL_STATE = {
  token: localStorage.getItem("token") || null, // Lưu token thay vì user
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        token: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        token: action.payload, // Lưu token trong state
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        token: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        token: null, // Xóa token khi logout
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.token) {
      localStorage.setItem("token", state.token); // Lưu token vào localStorage
    } else {
      localStorage.removeItem("token"); // Xóa token khi logout
    }
  }, [state.token]);

  return (
    <AuthContext.Provider
      value={{
        token: state.token, // Truyền token thay vì user
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
