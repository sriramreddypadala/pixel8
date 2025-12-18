import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GridTemplate } from '@/types/grid';
import { MOCK_GRID_TEMPLATES } from '@/types/grid';

interface GridStore {
  // Grid templates
  templates: GridTemplate[];
  activeGrid: GridTemplate | null;
  pendingGrid: GridTemplate | null;
  
  // Session state
  isSessionActive: boolean;
  
  // UI state
  selectedTemplateId: string | null;
  isGridBuilderOpen: boolean;
  
  // Actions - Template Management
  addTemplate: (template: GridTemplate) => void;
  updateTemplate: (id: string, updates: Partial<GridTemplate>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  
  // Actions - Grid Activation
  setActiveGrid: (templateId: string) => void;
  applyPendingGrid: () => void;
  clearPendingGrid: () => void;
  
  // Actions - Session Management
  startSession: () => void;
  endSession: () => void;
  
  // Actions - UI
  setSelectedTemplate: (id: string | null) => void;
  openGridBuilder: () => void;
  closeGridBuilder: () => void;
  
  // Utilities
  getTemplateById: (id: string) => GridTemplate | undefined;
  getGridsByStillCount: (count: number) => GridTemplate[];
  canApplyGridImmediately: () => boolean;
}

export const useGridStore = create<GridStore>()(
  persist(
    (set, get) => ({
      // Initial state
      templates: MOCK_GRID_TEMPLATES,
      activeGrid: MOCK_GRID_TEMPLATES[0],
      pendingGrid: null,
      isSessionActive: false,
      selectedTemplateId: null,
      isGridBuilderOpen: false,

      // Template Management
      addTemplate: (template) => {
        set((state) => ({
          templates: [...state.templates, template],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
          ),
          // Update active grid if it's the one being edited
          activeGrid:
            state.activeGrid?.id === id
              ? { ...state.activeGrid, ...updates, updatedAt: Date.now() }
              : state.activeGrid,
        }));
      },

      deleteTemplate: (id) => {
        set((state) => {
          const newTemplates = state.templates.filter((t) => t.id !== id);
          return {
            templates: newTemplates,
            // If deleting active grid, set first template as active
            activeGrid:
              state.activeGrid?.id === id
                ? newTemplates[0] || null
                : state.activeGrid,
            selectedTemplateId:
              state.selectedTemplateId === id ? null : state.selectedTemplateId,
          };
        });
      },

      duplicateTemplate: (id) => {
        const template = get().getTemplateById(id);
        if (!template) return;

        const duplicated: GridTemplate = {
          ...template,
          id: `grid_${Date.now()}`,
          name: `${template.name} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        get().addTemplate(duplicated);
      },

      // Grid Activation
      setActiveGrid: (templateId) => {
        const template = get().getTemplateById(templateId);
        if (!template) return;

        const { isSessionActive } = get();

        if (isSessionActive) {
          // Session active - set as pending
          set({ pendingGrid: template });
          console.log('[GridStore] Grid queued as pending:', template.name);
        } else {
          // No session - apply immediately
          set({ activeGrid: template, pendingGrid: null });
          console.log('[GridStore] Grid applied immediately:', template.name);
        }
      },

      applyPendingGrid: () => {
        const { pendingGrid } = get();
        if (pendingGrid) {
          set({ activeGrid: pendingGrid, pendingGrid: null });
          console.log('[GridStore] Pending grid promoted to active:', pendingGrid.name);
        }
      },

      clearPendingGrid: () => {
        set({ pendingGrid: null });
      },

      // Session Management
      startSession: () => {
        set({ isSessionActive: true });
        console.log('[GridStore] Session started - grid locked');
      },

      endSession: () => {
        set({ isSessionActive: false });
        // Auto-apply pending grid if exists
        get().applyPendingGrid();
        console.log('[GridStore] Session ended - grid unlocked');
      },
      
      // Get grids by still count
      getGridsByStillCount: (count: number) => {
        return get().templates.filter(t => t.isEnabled && t.stillCount === count);
      },

      // UI
      setSelectedTemplate: (id) => {
        set({ selectedTemplateId: id });
      },

      openGridBuilder: () => {
        set({ isGridBuilderOpen: true });
      },

      closeGridBuilder: () => {
        set({ isGridBuilderOpen: false, selectedTemplateId: null });
      },

      // Utilities
      getTemplateById: (id) => {
        return get().templates.find((t) => t.id === id);
      },

      canApplyGridImmediately: () => {
        return !get().isSessionActive;
      },
    }),
    {
      name: 'grid-storage',
      partialize: (state) => ({
        templates: state.templates,
        activeGrid: state.activeGrid,
      }),
    }
  )
);
