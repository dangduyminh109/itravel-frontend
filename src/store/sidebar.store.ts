import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  activeItem: string;
  toggleSidebar: () => void;
  setActiveItem: (name: string) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isOpen: true,
      activeItem: "",
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setActiveItem: (name: string) => set((state) => ({ activeItem: name })),
    }),
    {
      name: "sidebar-storage",
    },
  ),
);
