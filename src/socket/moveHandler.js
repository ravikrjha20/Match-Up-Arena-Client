import useMatchStore from "../store/useMatchStore";

export const setupMoveHandler = (socket) => {
  if (!socket) return;
  const { setUserMask, setOpponentMask, setTurn, setMatchStatus } =
    useMatchStore.getState();

  const handleGameMove = ({ userMask, opponentMask, turn, status }) => {
    setMatchStatus(status);
    setUserMask(userMask);
    setOpponentMask(opponentMask);
    setTurn(turn);
  };
  socket.on("gameMove", handleGameMove);
  return () => {
    socket.off("playMatchOnline1v1", handleGameMove);
  };
};
