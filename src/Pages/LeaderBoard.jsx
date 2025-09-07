import React from "react";
import ReactApexChart from "react-apexcharts";
import useAuthStore from "../store/useAuthStore";
import { HiClock, HiChartBar } from "react-icons/hi2";
import PleaseLogin from "./PleaseLogin";
import PlayerLeaderBoard from "../component/PlayerLeaderBoard";

// A simple, elegant loading component
const LoadingState = () => (
  <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] flex flex-col items-center justify-center text-white'>
    <HiClock className='h-12 w-12 animate-spin text-indigo-400' />
    <p className='mt-4 text-lg font-semibold'>Loading Rating Graph...</p>
  </div>
);

const LeaderBoard = () => {
  const { user } = useAuthStore();
  if (!user) return <PleaseLogin />;

  // ✅ case 1: user has no matches → only leaderboard
  if (!user.matches || user.matches.length < 1) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] p-6 sm:p-10'>
        <PlayerLeaderBoard userId={user._id} />
      </div>
    );
  }

  // ✅ case 2: user has matches → show chart + leaderboard
  const getRatingHistory = () => {
    const initialRating =
      user.matches[0].newRating - user.matches[0].ratingChange;
    const firstMatchDate = new Date(user.matches[0].date);

    const history = [
      {
        rating: initialRating,
        date: new Date(firstMatchDate.getTime() - 1000 * 60 * 60).toISOString(),
        change: 0,
        opponent: "Initial Rating",
      },
    ];

    user.matches.forEach((match) => {
      history.push({
        rating: match.newRating,
        date: match.date,
        change: match.ratingChange,
        opponent: match.opponentName,
      });
    });

    return history;
  };

  const ratingHistory = getRatingHistory();

  const chartOptions = {
    chart: {
      type: "area",
      height: 450,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3, colors: ["#818cf8"] },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: ["#312e81"],
        inverseColors: true,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: "datetime",
      categories: ratingHistory.map((h) => h.date),
      labels: { style: { colors: "#94a3b8" }, datetimeUTC: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8" },
        formatter: (val) => val.toFixed(0),
      },
    },
    grid: { borderColor: "#47556933", strokeDashArray: 4 },
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: ({ dataPointIndex }) => {
        const point = ratingHistory[dataPointIndex];
        const rating = point.rating;
        const change = point.change;
        const opponent = point.opponent;
        const resultColor =
          change > 0
            ? "text-emerald-400"
            : change < 0
            ? "text-rose-400"
            : "text-slate-400";

        return `
          <div class="p-2">
            <div class="font-bold text-lg">${rating}</div>
            <div class="text-sm ${resultColor}">${
          change > 0 ? "+" : ""
        }${change}</div>
            <div class="text-xs text-slate-400 mt-1">vs ${opponent}</div>
          </div>
        `;
      },
    },
    markers: {
      size: 5,
      colors: ["#4f46e5"],
      strokeColors: "#1e293b",
      strokeWidth: 2,
      hover: { size: 7 },
    },
  };

  const chartSeries = [
    { name: "Rating", data: ratingHistory.map((h) => h.rating) },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] p-6 sm:p-10'>
      <div className='mx-auto max-w-6xl'>
        <h1 className='text-4xl font-extrabold text-white tracking-tight mb-8'>
          Rating Progress
        </h1>
        <div className='rounded-xl shadow-2xl ring-1 ring-white/10 backdrop-blur-md bg-white/5 p-4'>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type='area'
            height={450}
          />
        </div>
        <PlayerLeaderBoard userId={user._id} />
      </div>
    </div>
  );
};

export default LeaderBoard;
