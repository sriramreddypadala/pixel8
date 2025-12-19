import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, Machine } from '@/types';

interface AdminStore {
  user: AdminUser | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  machines: Machine[];
  selectedMachineId: string | null;
  
  // Booth-first architecture
  selectedBoothId: string | null;
  selectedBoothName: string | null;
  
  isLoading: boolean;
  error: string | null;

  setUser: (user: AdminUser | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setMachines: (machines: Machine[]) => void;
  setSelectedMachine: (machineId: string | null) => void;
  updateMachine: (machineId: string, updates: Partial<Machine>) => void;
  
  // Booth selection (enforced)
  setSelectedBooth: (boothId: string | null, boothName?: string | null) => void;
  clearBoothSelection: () => void;
  hasBoothSelected: () => boolean;
  
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
      selectedBoothId: null,
      selectedBoothName: null,
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

      // Booth selection (mandatory for admin actions)
      setSelectedBooth: (boothId, boothName = null) => {
        set({ 
          selectedBoothId: boothId,
          selectedBoothName: boothName 
        });
      },

      clearBoothSelection: () => {
        set({ 
          selectedBoothId: null,
          selectedBoothName: null 
        });
      },

      hasBoothSelected: () => {
        return !!get().selectedBoothId;
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        selectedBoothId: null,
        selectedBoothName: null 
      }),
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        selectedBoothId: state.selectedBoothId,
        selectedBoothName: state.selectedBoothName,
      }),
    }
  )
);
