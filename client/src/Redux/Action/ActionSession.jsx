export const addSession = (token) => ({
  type: "ADD_SESSION",
  data: token,
});

export const deleteSession = () => ({
  type: "DELETE_SESSION",
});
