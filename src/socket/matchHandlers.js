import useMatchStore from "../store/useMatchStore";
import { toast } from "react-toastify";
import { checkFriend } from "../utils/someCleanup";

export const setupMatchHandlers = (socket, onMatchFound) => {
  if (!socket) return;
  const {
    setOpponentInfo,
    handleMatchTimeout,
    setTurn,
    setUserMark,
    setOpponentMark,
    setMatchStatus,
  } = useMatchStore.getState();
  const handleMatchFound = ({
    opponentId,
    opponentName,
    turn,
    mark,
    status,
    opponentMark,
  }) => {
    console.log("🎯 Matched with:", opponentId, opponentName, turn);
    toast.success(`Matched with ${opponentName || opponentId}`);
    setOpponentInfo({
      opponentId,
      opponentName,
      isFriend: checkFriend(opponentId),
    });
    setMatchStatus(status);
    setTurn(turn);
    setUserMark(mark);
    setOpponentMark(opponentMark);
    onMatchFound({ opponentId, opponentName });
  };

  const handleMatchTimeoutEvent = ({ message }) => {
    handleMatchTimeout();
    toast.error(message || "No opponent found in time.");
  };
  // Register the handlers
  socket.on("matchFound", handleMatchFound);
  socket.on("matchTimeout", handleMatchTimeoutEvent);
  // Return a cleanup function to remove listeners when the component unmounts
  return () => {
    socket.off("matchFound", handleMatchFound);
    socket.off("matchTimeout", handleMatchTimeoutEvent);
  };
};
