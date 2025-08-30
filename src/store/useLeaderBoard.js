import { create } from "zustand";
import axiosInstance from "../../lib/axios";

const useLeaderBoardStore = create((set, get) => ({
  leaderBoard: [],
  userRank: null,

  getLeaderBoard: async (userId = null) => {
    try {
      const res = await axiosInstance.post("competitive/getleaderboard", {
        userId, // only sent if provided
      });

      const { leaderboard, userRank } = res.data;

      set({
        leaderBoard: leaderboard || [],
        userRank: userRank || null,
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  },
}));

export default useLeaderBoardStore;
