import React from "react";
import { FaUserLock } from "react-icons/fa6";
import { Link } from "react-router-dom";

const PleaseLogin = ({ msg }) => {
  return (
    <div className='flex flex-col items-center justify-center h-[70vh] bg-gradient-to-br from-yellow-100 via-yellow-50 to-white px-4'>
      {/* Friendly Icon or SVG */}
      <div className='mb-6 animate-fade-in'>
        <FaUserLock className='text-[5rem] text-yellow-400 drop-shadow-md' />
      </div>
      {/* Message */}
      <div className='text-center mb-8 animate-fade-in-down'>
        <h2 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-2'>
          Welcome, Challenger!
        </h2>
        <p className='text-gray-600 text-lg'>
          {msg}
          <br />
          Join the action and track your progress!
        </p>
      </div>
      {/* Button */}
      <Link to='../auth/login' tabIndex={0}>
        <button
          className='bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-lg text-white font-bold px-8 py-3 rounded-full text-lg transition-all ring-yellow-400 focus:ring-2 focus:outline-none animate-bounce 
          hover:shadow-yellow-200 mt-2'
        >
          Login to Continue
        </button>
      </Link>
      {/* Add a fade-in keyframe! */}
      <style>{`
        @keyframes fade-in { from{opacity:0} to{opacity:1} }
        @keyframes fade-in-down { from{opacity:0; transform:translateY(-16px);} to{opacity:1; transform:translateY(0);} }
        .animate-fade-in { animation: fade-in .6s both;}
        .animate-fade-in-down { animation: fade-in-down .8s cubic-bezier(.42,0,.58,1) both;}
      `}</style>
    </div>
  );
};

export default PleaseLogin;
