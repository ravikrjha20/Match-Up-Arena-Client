import React, { useEffect, useMemo, useState } from "react";
import useLeaderBoardStore from "../store/useLeaderBoard";
import useAuthStore from "../store/useAuthStore";
import { avatars } from "../assets/Avatars";
import { FaCrown, FaArrowLeft, FaArrowRight } from "react-icons/fa";

const PAGE_SIZE = 10;

// A simple loading skeleton
const LoadingSkeleton = () => (
  <div className='space-y-3 mt-4'>
    {[...Array(5)].map((_, i) => (
      <div key={i} className='h-16 rounded-lg bg-slate-800/80 animate-pulse' />
    ))}
  </div>
);

const PlayerLeaderBoard = ({ userId }) => {
  /* -------- State and Zustand Selectors -------- */
  const [currentPage, setCurrentPage] = useState(1);
  const { leaderBoard, getLeaderBoard } = useLeaderBoardStore();
  const { user } = useAuthStore();

  /* -------- Fetch on mount / userId change -------- */
  useEffect(() => {
    getLeaderBoard(userId);
  }, [userId, getLeaderBoard]);

  /* -------- Memoized Data Processing -------- */
  const rankedPlayers = useMemo(
    () => leaderBoard.map((p, index) => ({ ...p, rank: index + 1 })),
    [leaderBoard]
  );

  const currentUserInList = useMemo(
    () => rankedPlayers.find((p) => p._id === user?._id),
    [rankedPlayers, user]
  );

  const otherPlayers = useMemo(
    () => rankedPlayers.filter((p) => p._id !== user?._id),
    [rankedPlayers, user]
  );

  const paginatedPlayers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return otherPlayers.slice(startIndex, endIndex);
  }, [otherPlayers, currentPage]);

  const totalPages = Math.ceil(otherPlayers.length / PAGE_SIZE);

  /* -------- Event Handlers -------- */
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /* -------- Reset page on data change -------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [userId]);

  /* -------- Loading State -------- */
  if (!leaderBoard.length) {
    return (
      <div className='p-4 max-w-2xl mx-auto mt-12'>
        <h2 className='text-3xl font-bold mb-6 text-center text-white'>
          <FaCrown className='inline-block mr-3 text-yellow-400' />
          Leaderboard
        </h2>
        <LoadingSkeleton />
      </div>
    );
  }

  /* -------- Render JSX -------- */
  return (
    <div className='p-4 max-w-2xl mx-auto mt-12'>
      <h2 className='text-3xl font-bold mb-6 text-center text-white'>
        <FaCrown className='inline-block mr-3 text-yellow-400' />
        Leaderboard
      </h2>

      {/* ----- Current User Card (Pinned to Top) ----- */}
      {currentUserInList && (
        <div className='p-4 mb-6 rounded-xl bg-slate-700/50 ring-1 ring-indigo-400 shadow-lg'>
          <div className='flex items-center gap-4'>
            <div className='text-2xl font-bold text-indigo-300 w-8 text-center'>
              #{currentUserInList.rank}
            </div>
            <img
              src={avatars[currentUserInList.avatar || 0]}
              alt='Your avatar'
              className='h-12 w-12 rounded-full ring-2 ring-indigo-400'
            />
            <div className='flex-grow'>
              <p className='font-bold text-lg text-white'>
                {currentUserInList.username} (You)
              </p>
              <p className='text-sm text-slate-300'>
                Rating: {currentUserInList.rating}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----- Other Players List (Paginated) ----- */}
      <div className='space-y-3 min-h-[520px]'>
        {paginatedPlayers.map((player) => (
          <div
            key={player._id}
            className='flex items-center p-3 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 transition-colors duration-200 shadow-md'
          >
            <div className='font-mono text-slate-400 text-center w-8 mr-4'>
              {player.rank}
            </div>
            <img
              src={avatars[player.avatar || 0]}
              alt={`${player.username}'s avatar`}
              className='flex-shrink-0 h-10 w-10 mr-4 rounded-full bg-indigo-500/30'
            />
            <div className='flex-grow'>
              <p className='font-semibold text-slate-100'>{player.username}</p>
              <p className='text-sm text-slate-400'>Rating: {player.rating}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ----- Pagination Controls ----- */}
      {totalPages > 1 && (
        <div className='flex items-center justify-center mt-8 space-x-4'>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className='flex items-center justify-center w-32 px-4 py-2 text-sm font-medium text-white bg-slate-700/50 rounded-lg hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-slate-500 transition-colors'
          >
            <FaArrowLeft className='mr-2' />
            Previous
          </button>

          <span className='text-slate-300 font-medium'>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className='flex items-center justify-center w-32 px-4 py-2 text-sm font-medium text-white bg-slate-700/50 rounded-lg hover:bg-slate-600/50 disabled:bg-slate-800/50 disabled:cursor-not-allowed disabled:text-slate-500 transition-colors'
          >
            Next
            <FaArrowRight className='ml-2' />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerLeaderBoard;
