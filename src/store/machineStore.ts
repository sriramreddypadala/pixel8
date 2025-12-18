import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MachineState, MachineMode, SessionData, PhotoLayout, CapturedPhoto, PrintStats, MachineConfig } from '@/types';
import { machineService } from '@/services/machine.service';
import { API_CONFIG } from '@/config/api.config';

interface MachineStore {
  machineId: string;
  mode: MachineMode;
  state: MachineState;
  config: MachineConfig | null;
  session: SessionData | null;
  printStats: PrintStats;
  isLoading: boolean;
  error: string | null;

  setState: (state: MachineState) => void;
  setMode: (mode: MachineMode) => void;
  setConfig: (config: MachineConfig) => void;
  
  startSession: () => void;
  setSessionLayout: (layout: PhotoLayout) => void;
  setSessionCopies: (copies: number) => void;
  addCapturedPhoto: (photo: CapturedPhoto) => void;
  removeCapturedPhoto: (photoId: string) => void;
  clearSession: () => void;
  
  incrementPrintCount: (copies: number, mode: MachineMode) => void;
  resetEventPrintCount: () => void;
  
  syncWithBackend: () => Promise<void>;
  loadConfig: () => Promise<void>;
}

export const useMachineStore = create<MachineStore>()(
  persist(
    (set, get) => ({
      machineId: API_CONFIG.MACHINE_ID,
      mode: 'NORMAL',
      state: 'IDLE',
      config: null,
      session: null,
      printStats: {
        totalPrints: 0,
        eventPrints: 0,
        normalPrints: 0,
        paperRemaining: 100,
      },
      isLoading: false,
      error: null,

      setState: (state) => set({ state }),

      setMode: (mode) => set({ mode }),

      setConfig: (config) => set({ config }),

      startSession: () => {
        const sessionId = `session-${Date.now()}`;
        set({
          session: {
            sessionId,
            layout: null,
            copies: 1,
            photos: [],
            mode: get().mode,
            startTime: Date.now(),
          },
          state: 'ACTIVE_SESSION',
        });
      },

      setSessionLayout: (layout) => {
        const session = get().session;
        if (session) {
          set({
            session: { ...session, layout },
          });
        }
      },

      setSessionCopies: (copies) => {
        const session = get().session;
        if (session) {
          set({
            session: { ...session, copies },
          });
        }
      },

      addCapturedPhoto: (photo) => {
        const session = get().session;
        if (session) {
          set({
            session: {
              ...session,
              photos: [...session.photos, photo],
            },
          });
        }
      },

      removeCapturedPhoto: (photoId) => {
        const session = get().session;
        if (session) {
          set({
            session: {
              ...session,
              photos: session.photos.filter((p) => p.id !== photoId),
            },
          });
        }
      },

      clearSession: () => {
        set({
          session: null,
          state: 'IDLE',
        });
      },

      incrementPrintCount: (copies, mode) => {
        const stats = get().printStats;
        const newStats = {
          ...stats,
          totalPrints: stats.totalPrints + copies,
          eventPrints: mode === 'EVENT' ? stats.eventPrints + copies : stats.eventPrints,
          normalPrints: mode === 'NORMAL' ? stats.normalPrints + copies : stats.normalPrints,
          lastPrintTime: Date.now(),
        };
        set({ printStats: newStats });

        get().syncWithBackend();
      },

      resetEventPrintCount: () => {
        const stats = get().printStats;
        set({
          printStats: {
            ...stats,
            eventPrints: 0,
          },
        });
      },

      syncWithBackend: async () => {
        try {
          const { machineId, printStats } = get();
          await machineService.syncPrintCount({
            machineId,
            totalPrints: printStats.totalPrints,
            eventPrints: printStats.eventPrints,
            normalPrints: printStats.normalPrints,
            timestamp: Date.now(),
          });
        } catch (error) {
          console.error('Failed to sync print count:', error);
        }
      },

      loadConfig: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await machineService.getConfig();
          if (response.success && response.data?.config) {
            set({
              config: response.data.config,
              mode: response.data.config.mode,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load config',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'machine-storage',
      partialize: (state) => ({
        machineId: state.machineId,
        mode: state.mode,
        printStats: state.printStats,
      }),
    }
  )
);
