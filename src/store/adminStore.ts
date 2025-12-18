import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, Machine } from '@/types';

interface AdminStore {
  user: AdminUser | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  machines: Machine[];
  selectedMachineId: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: AdminUser | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setMachines: (machines: Machine[]) => void;
  setSelectedMachine: (machineId: string | null) => void;
  updateMachine: (machineId: string, updates: Partial<Machine>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      theme: 'dark',
      machines: [],
      selectedMachineId: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const currentTheme = get().theme;
        set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
      },

      setMachines: (machines) => set({ machines }),

      setSelectedMachine: (machineId) => set({ selectedMachineId: machineId }),

      updateMachine: (machineId, updates) => {
        const machines = get().machines;
        const updatedMachines = machines.map((m) =>
          m.id === machineId ? { ...m, ...updates } : m
        );
        set({ machines: updatedMachines });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);
