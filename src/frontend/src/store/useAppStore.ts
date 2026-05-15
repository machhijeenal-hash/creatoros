import type { UserProfile } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AppState {
  // Auth
  isAuthenticated: boolean;
  principal: string | null;

  // User
  userProfile: UserProfile | null;
  profileLoading: boolean;

  // UI
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;

  // Actions
  setAuthenticated: (value: boolean, principal?: string) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setProfileLoading: (value: boolean) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  setCommandPaletteOpen: (value: boolean) => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  principal: null,
  userProfile: null,
  profileLoading: false,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setAuthenticated: (value, principal) =>
        set({ isAuthenticated: value, principal: principal ?? null }),

      setUserProfile: (profile) => set({ userProfile: profile }),

      setProfileLoading: (value) => set({ profileLoading: value }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),

      setCommandPaletteOpen: (value) => set({ commandPaletteOpen: value }),

      reset: () => set(initialState),
    }),
    {
      name: "creatoros-app",
      partialize: (state: AppState) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
