import { CurrentAccount } from "@/features/auth/types/currentAccount.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";
interface AuthState {
  account: CurrentAccount | null;
  setAccount: (account: CurrentAccount) => void;
  clearAccount: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      setAccount: (account) => set({ account }),
      clearAccount: () => set({ account: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);