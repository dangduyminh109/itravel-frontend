import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LoadingState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>()(
  persist(
    (set) => ({
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "loading-storage",
    },
  ),
);
