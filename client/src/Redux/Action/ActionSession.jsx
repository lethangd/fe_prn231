export const addSession = (token) => {
  return {
    type: "ADD_SESSION",
    data: token,
  };
};

export const deleteSession = () => {
  return {
    type: "DELETE_SESSION",
    data: "",
  };
};
