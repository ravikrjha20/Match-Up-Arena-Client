import useFriendStore from "../store/useFriendStore";

export const setUpFriends = (socket, username) => {
  if (!socket) return;

  const { getAllFriends, getIncomingRequests, getOutgoingRequests } =
    useFriendStore.getState();

  const updateFriendList = () => {
    console.log(username);
    getAllFriends(username);
  };
  const updateIncomingRequest = () => getIncomingRequests();
  const updateOutgoingReq = () => getOutgoingRequests();

  socket.on("updateFriendList", updateFriendList);
  socket.on("updateIncomingRequest", updateIncomingRequest);
  socket.on("updateOutgoingReq", updateOutgoingReq);
  socket.on("friendRemoved", updateFriendList);
  socket.on("friendStatusChanged", updateFriendList);

  return () => {
    socket.off("updateFriendList", updateFriendList);
    socket.off("updateIncomingRequest", updateIncomingRequest);
    socket.off("updateOutgoingReq", updateOutgoingReq);
    socket.off("friendRemoved", updateFriendList);
    socket.off("friendStatusChanged", updateFriendList);
  };
};
