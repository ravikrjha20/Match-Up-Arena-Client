import React, { useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { avatars } from "../assets/Avatars";
import useClickOutside from "../hooks/useClickOutside";

const ShowAvatars = ({ onSelectAvatar, onClose }) => {
  const modalRef = useRef(null);

  // Close modal on clicking the backdrop
  useClickOutside(modalRef, onClose);

  const handleAvatarSelect = (index) => {
    onSelectAvatar(index);
    onClose();
  };

  return (
    // Backdrop with a fade-in animation
    <div className='fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in'>
      {/* Modal container with a pop-in animation */}
      <div
        ref={modalRef}
        className='relative w-full max-w-xl bg-gray-900/60 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl p-6 text-white animate-modal-pop'
      >
        {/* Close Button with enhanced styling */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1.5 transition-all'
          aria-label='Close'
        >
          <FaTimes size={20} />
        </button>

        {/* Gradient Title */}
        <h2 className='text-2xl sm:text-3xl font-bold text-center mb-5 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500'>
          Choose Your Avatar
        </h2>

        {/* Avatar Grid */}
        <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar'>
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className='aspect-w-1 aspect-h-1 p-1' // Container for animation
              onClick={() => handleAvatarSelect(index)}
            >
              <img
                src={avatar}
                alt={`Avatar ${index}`}
                className='w-full h-full rounded-full object-cover cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-110 hover:ring-2 hover:ring-pink-500/80 shadow-lg hover:shadow-pink-500/30'
              />
            </div>
          ))}
        </div>
      </div>

      {/* Embedded CSS for animations and custom scrollbar */}
      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; } 
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out both; }

        @keyframes modal-pop { 
          from { opacity: 0; transform: scale(0.95) translateY(30px); } 
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) both; }

        /* Custom Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ShowAvatars;
