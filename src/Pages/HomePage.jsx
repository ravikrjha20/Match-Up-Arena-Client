import React, { useEffect } from "react";
import NavBar from "../component/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Notification from "../component/InviteNotification";
import { getSocket } from "../socket/socket";
import useAuthStore from "../store/useAuthStore";
import { setupInviteHandlers } from "../socket/inviteFriend";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = getSocket();

  const handleStartGame = ({ opponentId, opponentName }) => {
    navigate(`/online/quick/letsplay`);
  };

  useEffect(() => {
    if (socket && user) {
      const onMatchFound = ({ opponentId, opponentName }) => {
        setTimeout(() => {
          handleStartGame({ opponentId, opponentName });
        }, 2000);
      };

      const cleanup = setupInviteHandlers(socket, onMatchFound);

      return cleanup;
    }
  }, [socket, user, navigate]);

  return (
    <div className='min-h-screen flex flex-col bg-white text-gray-800'>
      <NavBar />
      <Notification />
      <Outlet />
    </div>
  );
};

export default HomePage;
