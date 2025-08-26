import React, { useState, useCallback } from "react"; // Import useCallback
import { Link, useNavigate } from "react-router-dom";
import TicTacToe from "../component/TicTacToe";
import { toast } from "react-toastify";
import bgLogin from "../assets/bgLogin.avif";
import useAuthStore from "../store/useAuthStore";
import ShowAvatars from "../component/ShowAvatars";
import { avatars } from "../assets/Avatars";

const Register = () => {
  const navigate = useNavigate();
  const { checkAuth, register } = useAuthStore();
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: 0, // Default to the first avatar
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Create a specific handler for avatar selection
  const handleSelectAvatar = (index) => {
    setFormData((prevFormData) => ({ ...prevFormData, avatar: index }));
  };

  // ✅ Wrap onClose in useCallback for stability
  const handleClosePopup = useCallback(() => {
    setShowAvatarPopup(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // ... (Validation logic remains the same) ...
    const { name, username, email, password, confirmPassword } = formData;
    if (!name || !username || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      toast.error(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include one uppercase letter"
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await register(formData);
      await checkAuth();
      navigate("../");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center bg-cover bg-center p-4'
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className='backdrop-blur-md bg-white/10 border-white/30 rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row gap-6 overflow-hidden'>
        <div className='w-full md:w-1/2 p-8 flex flex-col justify-center text-white'>
          <div className='flex flex-col items-center mb-4'>
            {/* Avatar preview is now always visible and clickable */}
            <div
              className='w-20 h-20 rounded-full overflow-hidden border-2 border-white/40 cursor-pointer mb-3 transition-transform hover:scale-105'
              onClick={() => setShowAvatarPopup(true)}
            >
              <img
                src={avatars[formData.avatar]}
                alt='Selected Avatar'
                className='w-full h-full object-cover'
              />
            </div>
            <h2 className='text-3xl font-bold text-center'>Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Form inputs remain the same */}
            <div>
              <label className='block mb-1 text-sm'>Full Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-2 rounded bg-white/20 border border-white/30 placeholder-white/70 focus:ring-2 focus:ring-white text-white'
                placeholder='Your Name'
              />
            </div>
            <div>
              <label className='block mb-1 text-sm'>Username</label>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleChange}
                className='w-full px-4 py-2 rounded bg-white/20 border border-white/30 placeholder-white/70 focus:ring-2 focus:ring-white text-white'
                placeholder='username'
              />
            </div>
            <div>
              <label className='block mb-1 text-sm'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full px-4 py-2 rounded bg-white/20 border border-white/30 placeholder-white/70 focus:ring-2 focus:ring-white text-white'
                placeholder='you@example.com'
              />
            </div>
            <div>
              <label className='block mb-1 text-sm'>Password</label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='w-full px-4 py-2 rounded bg-white/20 border border-white/30 placeholder-white/70 focus:ring-2 focus:ring-white text-white'
                placeholder='••••••••'
              />
            </div>
            <div>
              <label className='block mb-1 text-sm'>Confirm Password</label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='w-full px-4 py-2 rounded bg-white/20 border border-white/30 placeholder-white/70 focus:ring-2 focus:ring-white text-white'
                placeholder='••••••••'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full py-2 bg-white/30 hover:bg-white/50 text-white rounded font-semibold transition disabled:bg-white/10 disabled:cursor-not-allowed'
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className='text-xs text-center mt-4 text-white/80'>
            Already have an account?{" "}
            <Link to='../auth/login' className='underline font-semibold'>
              Sign In
            </Link>
          </p>
        </div>
        <div className='hidden md:block w-px bg-white/30 mx-2' />
        <div className='hidden md:flex w-full md:w-1/2 p-6 flex-col justify-center items-center'>
          <h3 className='text-white mb-3 font-semibold'>Take a Break 🎮</h3>
          <TicTacToe />
        </div>
      </div>

      {/* ✅ Pass the correct props to the modal */}
      {showAvatarPopup && (
        <ShowAvatars
          onSelectAvatar={handleSelectAvatar}
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
};

export default Register;
