import { create } from "zustand";

interface SidebarState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>((set) => {
  const savedState = localStorage.getItem("sidebarOpen");
  return {
    sidebarOpen: savedState ? JSON.parse(savedState) : false,
    setSidebarOpen: (open) => {
      localStorage.setItem("sidebarOpen", JSON.stringify(open));
      set({ sidebarOpen: open });
    },
  };
});
