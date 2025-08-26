import React from "react";
import ReactApexChart from "react-apexcharts";
import useAuthStore from "../store/useAuthStore";
import { HiClock, HiChartBar } from "react-icons/hi2";

// A simple, elegant loading component
const LoadingState = () => (
  <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] flex flex-col items-center justify-center text-white'>
    <HiClock className='h-12 w-12 animate-spin text-indigo-400' />
    <p className='mt-4 text-lg font-semibold'>Loading Rating Graph...</p>
  </div>
);

// Empty state for when there's not enough data
const EmptyState = () => (
  <div className='min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b0764] flex flex-col items-center justify-center text-white text-center p-4'>
    <HiChartBar className='h-16 w-16 text-indigo-500' />
    <h2 className='mt-4 text-2xl font-bold'>Not Enough Data</h2>
    <p className='mt-2 text-slate-300'>
      Play at least one match to see your rating progress.
    </p>
  </div>
);

const LeaderBoard = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <LoadingState />;
  }

  if (!user.matches || user.matches.length < 1) {
    return <EmptyState />;
  }

  // ✅ UPDATED LOGIC: Use `newRating` for accurate plotting
  const getRatingHistory = () => {
    // Calculate the rating the user had *before* their first match
    const initialRating =
      user.matches[0].newRating - user.matches[0].ratingChange;
    const firstMatchDate = new Date(user.matches[0].date);

    // The history starts with the calculated initial rating
    const history = [
      {
        rating: initialRating,
        date: new Date(firstMatchDate.getTime() - 1000 * 60 * 60).toISOString(),
        change: 0,
        opponent: "Initial Rating",
      },
    ];

    // Map over each match and use its `newRating` as the data point
    user.matches.forEach((match) => {
      history.push({
        rating: match.newRating, // Use the newRating directly
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
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#818cf8"],
    },
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
      labels: {
        style: {
          colors: "#94a3b8",
        },
        datetimeUTC: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
        },
        formatter: (val) => val.toFixed(0),
      },
    },
    grid: {
      borderColor: "#47556933",
      strokeDashArray: 4,
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
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
      hover: {
        size: 7,
      },
    },
  };

  const chartSeries = [
    {
      name: "Rating",
      data: ratingHistory.map((h) => h.rating),
    },
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
      </div>
    </div>
  );
};

export default LeaderBoard;
