import { create } from "zustand";
import axiosInstance from "../../lib/axios";
import useAuthStore from "./useAuthStore";

const { user } = useAuthStore.getState();

const useMatchStore = create((set, get) => ({
  userMask: 0,
  opponentMask: 0,
  turn: false,
  mark: "X",
  opponentMark: "O",
  opponentId: null,
  opponentName: null,
  matchStatus: null, // "ongoing", "win", "draw"
  matchmakingStatus: "idle", // idle, pending, success, error, timeout
  matchmakingMessage: "",
  isFriend: false,

  // --- Actions ---
  setUserMask: (mask) => set({ userMask: mask }),
  setUserMark: (mark) => set({ mark }),
  setOpponentMark: (mark) => set({ opponentMark: mark }),
  setOpponentMask: (mask) => set({ opponentMask: mask }),
  setTurn: (turn) => set({ turn }),
  setMatchStatus: (status) => set({ matchStatus: status }),
  setMatchMakingStatus: (status) => set({ matchmakingStatus: status }),
  setOpponentName: (name) => set({ opponentName: name }),
  acceptInvite: async (friendId) => {
    try {
      const res = await axiosInstance.post(`play/acceptInvite/${friendId}`);
      set({ matchmakingMessage: res.data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  rejectInvite: async (friendId) => {
    try {
      const res = await axiosInstance.post(`play/rejectInvite/${friendId}`);
      set({ matchmakingMessage: res.data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  cancelInvite: async (friendId) => {
    try {
      const res = await axiosInstance.post(`play/cancelRequest`);
      get().resetMatch();
      set({ matchmakingMessage: res.data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  inviteFriend: async (friendId) => {
    try {
      const res = await axiosInstance.post(`play/playonevone/${friendId}`);
      set({ matchmakingMessage: res.data });
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  cancelSearch: (socket) => {
    socket.emit("cancelSearch");
    get().resetMatch();
    set({
      matchmakingStatus: "idle",
      matchmakingMessage: "Search cancelled.",
    });
  },

  findPlayer: async () => {
    if (get().matchmakingStatus === "pending") return;

    set({
      matchmakingStatus: "pending",
      matchmakingMessage: "Searching for an opponent...",
    });

    try {
      const res = await axiosInstance.get(`play/playonevone`);
      set({ matchmakingMessage: res.data.message });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to start matchmaking.";
      set({ matchmakingStatus: "error", matchmakingMessage: message });
    }
  },

  setOpponentInfo: ({ opponentId, opponentName, isFriend }) =>
    set({
      opponentId,
      opponentName,
      matchmakingStatus: "success",
      matchmakingMessage: `Match found with ${opponentName || opponentId}!`,
      isFriend,
    }),

  handleMatchTimeout: () => {
    get().resetMatch();
  },

  makeMove: async (cellIndex) => {
    const { opponentId, userMask, opponentMask, turn, isFriend } = get();
    if (!turn) return;
    get().setUserMark(get().userMask | (1 << cellIndex));
    const bit = 1 << cellIndex;
    if (userMask & bit || opponentMask & bit) return;

    const newMask = userMask | bit;

    try {
      await axiosInstance.post(`/play/quick/onevone/${opponentId}`, {
        mask: newMask,
        opponentMask,
        isFriend,
      });
    } catch (err) {
      console.error("Error sending move:", err);
    }
  },

  resetMatch: () =>
    set({
      userMask: 0,
      opponentMask: 0,
      turn: false,
      opponentId: null,
      opponentName: null,
      matchmakingStatus: "idle",
      matchmakingMessage: "",
      isFriend: false,
    }),
}));

export default useMatchStore;
