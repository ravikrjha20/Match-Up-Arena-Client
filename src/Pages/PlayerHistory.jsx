import React from "react";
import {
  HiOutlineTrophy,
  HiXMark,
  HiMinus,
  HiUser,
  HiClock,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi2";
import useAuthStore from "../store/useAuthStore";
import { avatars } from "../assets/Avatars"; // Make sure to import your avatars
import PleaseLogin from "./PleaseLogin";
/* ───────────────── helpers ───────────────── */
const fmt = (d) =>
  new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const badge = (r) =>
  r === "win"
    ? "bg-emerald-500/15 text-emerald-400"
    : r === "loss"
    ? "bg-rose-500/15 text-rose-400"
    : "bg-amber-400/15 text-amber-300";

const icon = (r) =>
  r === "win" ? (
    <HiOutlineTrophy className='shrink-0 h-4 w-4' />
  ) : r === "loss" ? (
    <HiXMark className='shrink-0 h-4 w-4' />
  ) : (
    <HiMinus className='shrink-0 h-4 w-4' />
  );

// Helper for rating change styling
const ratingColor = (result) => {
  if (result === "win") return "text-emerald-400";
  if (result === "loss") return "text-rose-400";
  return "text-slate-400";
};

// A simple, elegant loading component
const LoadingState = () => (
  <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] flex flex-col items-center justify-center text-white'>
    <HiClock className='h-12 w-12 animate-spin text-indigo-400' />
    <p className='mt-4 text-lg font-semibold'>Loading History...</p>
  </div>
);

/* ───────────────── component ───────────────── */
const PlayerHistory = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <LoadingState />;
  }

  const matches = user?.matches || [];

  if (!user)
    return (
      <PleaseLogin msg={`You must be logged in to view and update profile`} />
    );
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] p-6 sm:p-10'>
      <div className='mx-auto max-w-6xl'>
        {/* header */}
        <div className='flex items-center gap-4'>
          <img
            src={avatars[user.avatar]}
            alt='Your Avatar'
            className='h-16 w-16 rounded-full ring-2 ring-white/20'
          />
          <div>
            <h1 className='text-4xl font-extrabold text-white tracking-tight'>
              {user.name}'s History
            </h1>
            <p className='text-indigo-300'>@{user.username}</p>
          </div>
        </div>

        {/* stats summary */}
        <div className='mt-8 grid grid-cols-3 gap-4 text-center sm:max-w-md'>
          {["win", "loss", "draw"].map((r) => (
            <div
              key={r}
              className={`rounded-lg py-3 backdrop-blur-md ring-1 ring-white/10 ${badge(
                r
              )}`}
            >
              <p className='text-lg font-semibold capitalize'>{r}s</p>
              <p className='text-2xl font-bold'>
                {matches.filter((m) => m.result === r).length}
              </p>
            </div>
          ))}
        </div>

        {/* desktop table */}
        <div className='mt-10 hidden lg:block rounded-xl shadow-2xl ring-1 ring-white/10 backdrop-blur-md bg-white/5'>
          <table className='min-w-full text-sm text-slate-200'>
            <thead className='bg-white/10 text-left text-xs uppercase tracking-wider text-slate-300'>
              <tr>
                <th className='px-6 py-4'>Matchup</th>
                <th className='px-6 py-4'>Result</th>
                <th className='px-6 py-4'>Mode</th>
                <th className='px-6 py-4'>Date</th>
                <th className='px-6 py-4 text-right'>Rating Change</th>
              </tr>
            </thead>
            <tbody>
              {matches.map((m, i) => (
                <tr
                  key={i}
                  className='hover:bg-white/10 transition-colors duration-150'
                >
                  <td className='px-6 py-4 font-medium'>
                    <div className='flex items-center gap-3'>
                      <img
                        src={avatars[user.avatar]}
                        className='h-8 w-8 rounded-full'
                        alt='Your Avatar'
                      />
                      <span className='font-bold'>{user.name}</span>
                      <span className='text-slate-400'>vs</span>
                      <span className='font-bold'>{m.opponentName}</span>
                      <img
                        src={avatars[m.opponentAvatar]}
                        className='h-8 w-8 rounded-full'
                        alt="Opponent's Avatar"
                      />
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${badge(
                        m.result
                      )}`}
                    >
                      {icon(m.result)}
                      {m.result}
                    </span>
                  </td>
                  <td className='px-6 py-4 capitalize'>{m.mode}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{fmt(m.date)}</td>
                  <td
                    className={`px-6 py-4 text-right font-bold ${ratingColor(
                      m.result
                    )}`}
                  >
                    {m.result === "win" ? "+" : ""}
                    {m.ratingChange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile timeline */}
        <ol className='relative mt-10 space-y-8 border-s-4 border-indigo-600/40 lg:hidden'>
          {matches.map((m, i) => (
            <li key={i} className='ms-6'>
              <span className='absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-indigo-600/30'>
                {icon(m.result)}
              </span>
              <div className='rounded-xl bg-white/5 p-4 backdrop-blur-md shadow-lg ring-1 ring-white/10'>
                <div className='flex items-center justify-between'>
                  <p className='font-semibold text-white'>
                    {user.name} vs {m.opponentName}
                  </p>
                  <span
                    className={`font-bold text-lg ${ratingColor(m.result)}`}
                  >
                    {m.result === "win" ? "+" : ""}
                    {m.ratingChange}
                  </span>
                </div>
                <div className='mt-2 flex justify-between items-center text-sm'>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${badge(
                      m.result
                    )}`}
                  >
                    {m.result}
                  </span>
                  <p className='text-indigo-200'>
                    {m.mode} • {fmt(m.date)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* empty state */}
        {matches.length === 0 && (
          <div className='mt-24 text-center text-indigo-200'>
            <p className='text-xl font-medium'>No matches yet.</p>
            <p className='text-sm'>Play a game to start building history!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerHistory;
