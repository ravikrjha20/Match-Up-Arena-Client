import React, { useState, useCallback } from "react";
import useAuthStore from "../store/useAuthStore";
import ShowAvatars from "../component/ShowAvatars"; // adjust path
import { avatars } from "../assets/Avatars"; // adjust path

const UpdateProfile = () => {
  const { user, update } = useAuthStore();
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    // Use the avatar index from the user object, or default to 0
    avatar: user?.avatar || 0,
    previousPassword: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Specific handler for avatar selection from the modal
  const handleSelectAvatar = (index) => {
    setFormData((prevFormData) => ({ ...prevFormData, avatar: index }));
    setShowAvatarPopup(false); // Close the popup after selection
  };

  // Memoized handler to close the popup
  const handleClosePopup = useCallback(() => {
    setShowAvatarPopup(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      // Send only the fields that have values
      const updatedData = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        avatar: formData.avatar,
      };

      // Only include password fields if they are filled
      if (formData.password && formData.previousPassword) {
        updatedData.password = formData.password;
        updatedData.previousPassword = formData.previousPassword;
      }
      update(formData);
      setMessage("Profile updated successfully!");

      // Reset password fields after submission
      setFormData((prev) => ({
        ...prev,
        previousPassword: "",
        password: "",
      }));
    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "An error occurred while updating."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='w-full max-w-2xl bg-white rounded-lg shadow-md p-6 sm:p-8'>
          <div className='flex flex-col items-center mb-6'>
            {/* Clickable Avatar Preview */}
            <div
              className='w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer transition-transform hover:scale-105'
              onClick={() => setShowAvatarPopup(true)}
            >
              <img
                src={avatars[formData.avatar]}
                alt='Selected Avatar'
                className='w-full h-full object-cover'
              />
            </div>
            <h2 className='text-2xl font-bold text-gray-800 mt-4'>
              Update Your Profile
            </h2>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Form inputs remain the same */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Name
              </label>
              <input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                placeholder='Enter your full name'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium text-gray-700'
              >
                Username
              </label>
              <input
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                placeholder='Enter your username'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Enter your email address'
                className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
              />
            </div>

            <hr className='border-gray-200' />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='previousPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Current Password
                </label>
                <input
                  id='previousPassword'
                  type='password'
                  name='previousPassword'
                  value={formData.previousPassword}
                  onChange={handleChange}
                  placeholder='Enter current password'
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password
                </label>
                <input
                  id='password'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter new password'
                  className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed'
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>

            {message && (
              <p
                className={`text-sm text-center ${
                  isError ? "text-red-600" : "text-green-600"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Conditionally render the avatar selection modal */}
      {showAvatarPopup && (
        <ShowAvatars
          onSelectAvatar={handleSelectAvatar}
          onClose={handleClosePopup}
        />
      )}
    </>
  );
};

export default UpdateProfile;
