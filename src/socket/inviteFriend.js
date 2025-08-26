import useMatchStore from "../store/useMatchStore";
import useNotificationStore from "../store/useNotificationStore";
import { toast } from "react-toastify";
import { checkFriend } from "../utils/someCleanup";

export const setupInviteHandlers = (socket, onMatchFound) => {
  if (!socket) return;
  const {
    setOpponentInfo,
    handleMatchTimeout,
    setTurn,
    setUserMark,
    setOpponentMark,
    setMatchStatus,
    acceptInvite,
    rejectInvite,
    resetMatch,
  } = useMatchStore.getState();
  const { showNotification, hideNotification } =
    useNotificationStore.getState();

  // When a friend invites you
  const handleFriendInvite = ({ fromId, fromName }) => {
    const message = `${fromName} is inviting you to play 1v1`;
    const type = "invitation";

    toast.info(`🎮 ${fromName} invited you to play!`, { autoClose: 3000 });

    showNotification(message, type, {
      onAccept: () => {
        toast.success(`✅ You accepted ${fromName}'s invite`);
        acceptInvite(fromId);
      },
      onReject: () => {
        toast.error(`❌ You rejected ${fromName}'s invite`);
        rejectInvite(fromId);
      },
    });
  };

  // When match successfully starts
  const handleMatchFound = ({
    opponentId,
    opponentName,
    turn,
    mark,
    status,
    opponentMark,
  }) => {
    toast.success(`🔥 Match found with ${opponentName || opponentId}`, {
      autoClose: 2500,
    });

    setOpponentInfo({
      opponentId,
      opponentName,
      isFriend: true,
    });
    setMatchStatus(status);
    setTurn(turn);
    setUserMark(mark);
    setOpponentMark(opponentMark);
    onMatchFound({ opponentId, opponentName });
  };

  // When the match times out
  const handleMatchTimeoutEvent = ({ message }) => {
    toast.warning(`⏳ Match timed out: ${message || "No response"}`, {
      autoClose: 3000,
    });
    resetMatch();
  };

  // When your invite is rejected
  const inviteRejected = () => {
    toast.error("🚫 Your invite was rejected", { autoClose: 3000 });
    resetMatch();
  };

  // When your friend cancels the invite
  const inviteCancelled = () => {
    hideNotification();
  };

  // Attach socket listeners
  socket.on("friendInvite", handleFriendInvite);
  socket.on("matchFoundFriend", handleMatchFound);
  socket.on("inviteRejected", inviteRejected);
  socket.on("inviteCancelled", inviteCancelled);
  socket.on("matchTimeout", handleMatchTimeoutEvent);

  // Cleanup listeners
  return () => {
    socket.off("friendInvite", handleFriendInvite);
    socket.off("matchFoundFriend", handleMatchFound);
    socket.off("inviteRejected", inviteRejected);
    socket.off("inviteCancelled", inviteCancelled);
    socket.off("matchTimeout", handleMatchTimeoutEvent);
  };
};
