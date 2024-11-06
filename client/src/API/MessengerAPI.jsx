import axiosClient from "./axiosClient";

const MessengerAPI = {
  getMessage: (query) => {
    const url = `/messenger/${query}`; // Chưa có API messenger
    return axiosClient.get(url);
  },

  postMessage: (query) => {
    const url = `/messenger/send${query}`; // Chưa có API messenger/send
    return axiosClient.post(url);
  },

  postConversation: (query) => {
    const url = `/messenger/conversation${query}`; // Chưa có API messenger/conversation
    return axiosClient.post(url);
  },
};

export default MessengerAPI;
