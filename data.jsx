import { FaHome, FaGamepad, FaGlobe, FaRobot, FaUser } from "react-icons/fa";

export const getNavData = (user) => [
  {
    label: "Home",
    icon: <FaHome className='text-lg' />,
    children: [
      {
        label: "Home",
        path: "/",
      },
      {
        label: "About",
        path: "/about",
      },
    ],
  },
  {
    label: "Lets Play",
    icon: <FaGamepad className='text-lg' />,
    children: [
      {
        label: "Offline",
        path: "/1v1/friend/offline",
      },
      {
        label: "With Friend",
        path: "/1v1/friend/online",
      },
      {
        label: "Quick Match",
        path: "/online/quick",
      },
    ],
  },
  // {
  //   label: "Play Online",
  //   icon: <FaGlobe className='text-lg' />,
  //   children: [],
  // },
  {
    label: "Play vs Computer",
    icon: <FaRobot className='text-lg' />,
    children: [
      {
        label: "Easy",
        path: "/computer/game?difficulty=easy",
      },
      {
        label: "Medium",
        path: "/computer/game?difficulty=medium",
      },
      {
        label: "Hard",
        path: "/computer/game?difficulty=hard",
      },
    ],
  },
  {
    label: user?.name || "Login",
    icon: <FaUser className='text-lg' />,
    tab: "Profile",
    authOnly: true,
    children: user
      ? [
          {
            label: "Profile",
            path: `/profile/${user?.username || "null"}`,
          },
          {
            label: "Settings",
            path: "/profile/settings",
          },
          {
            label: "Logout",
            path: "/auth/logout",
          },
        ]
      : [
          {
            label: "Login",
            path: "/auth/login",
          },
          {
            label: "Sign Up",
            path: "/auth/register",
          },
        ],
  },
];
