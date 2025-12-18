import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Save, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { GridCanvas } from './GridCanvas';
import { SlotControls } from './SlotControls';
import { useGridStore } from '@/store/gridStore';
import type { GridTemplate, GridSlot, AspectRatio } from '@/types/grid';
import { ASPECT_RATIOS } from '@/types/grid';
import { generateId } from '@/utils/helpers';

type GridBuilderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  templateId?: string | null;
};

export function GridBuilderModal({
  isOpen,
  onClose,
  templateId,
}: GridBuilderModalProps) {
  const { templates, addTemplate, updateTemplate, getTemplateById } = useGridStore();
  
  const existingTemplate = templateId ? getTemplateById(templateId) : null;
  
  const [grid, setGrid] = useState<GridTemplate>(
    existingTemplate || {
      id: `grid_${Date.now()}`,
      name: 'New Grid',
      aspectRatio: '4:6',
      canvasWidth: 1200,
      canvasHeight: 1800,
      backgroundColor: '#ffffff',
      slots: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const selectedSlot = grid.slots.find((s) => s.id === selectedSlotId) || null;
  const selectedSlotIndex = grid.slots.findIndex((s) => s.id === selectedSlotId);

  // Update grid property
  const updateGrid = (updates: Partial<GridTemplate>) => {
    setGrid((prev) => ({ ...prev, ...updates, updatedAt: Date.now() }));
  };

  // Update slot
  const updateSlot = (slotId: string, updates: Partial<GridSlot>) => {
    setGrid((prev) => ({
      ...prev,
      slots: prev.slots.map((s) => (s.id === slotId ? { ...s, ...updates } : s)),
      updatedAt: Date.now(),
    }));
  };

  // Add new slot
  const addSlot = () => {
    const newSlot: GridSlot = {
      id: generateId(),
      x: 10,
      y: 10,
      width: 40,
      height: 40,
      radius: 12,
      zIndex: grid.slots.length,
    };
    setGrid((prev) => ({
      ...prev,
      slots: [...prev.slots, newSlot],
    }));
    setSelectedSlotId(newSlot.id);
  };

  // Delete slot
  const deleteSlot = (slotId: string) => {
    setGrid((prev) => ({
      ...prev,
      slots: prev.slots.filter((s) => s.id !== slotId),
    }));
    setSelectedSlotId(null);
  };

  // Duplicate slot
  const duplicateSlot = (slotId: string) => {
    const slot = grid.slots.find((s) => s.id === slotId);
    if (!slot) return;

    const newSlot: GridSlot = {
      ...slot,
      id: generateId(),
      x: slot.x + 5,
      y: slot.y + 5,
      zIndex: grid.slots.length,
    };
    setGrid((prev) => ({
      ...prev,
      slots: [...prev.slots, newSlot],
    }));
    setSelectedSlotId(newSlot.id);
  };

  // Move slot up/down in order
  const moveSlot = (slotId: string, direction: 'up' | 'down') => {
    const index = grid.slots.findIndex((s) => s.id === slotId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= grid.slots.length) return;

    const newSlots = [...grid.slots];
    [newSlots[index], newSlots[newIndex]] = [newSlots[newIndex], newSlots[index]];

    setGrid((prev) => ({ ...prev, slots: newSlots }));
  };

  // Change aspect ratio
  const changeAspectRatio = (ratio: AspectRatio) => {
    const config = ASPECT_RATIOS[ratio];
    const baseWidth = 1200;
    const height = (baseWidth * config.height) / config.width;

    updateGrid({
      aspectRatio: ratio,
      canvasWidth: baseWidth,
      canvasHeight: height,
    });
  };

  // Save grid
  const handleSave = () => {
    if (existingTemplate) {
      updateTemplate(grid.id, grid);
    } else {
      addTemplate(grid);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={existingTemplate ? 'Edit Grid Template' : 'Create Grid Template'}
      size="full"
    >
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Panel - Canvas */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Grid Info */}
            <div className="space-y-3">
              <Input
                label="Grid Name"
                value={grid.name}
                onChange={(e) => updateGrid({ name: e.target.value })}
                placeholder="e.g., 2x2 Grid"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Aspect Ratio
                  </label>
                  <select
                    value={grid.aspectRatio}
                    onChange={(e) => changeAspectRatio(e.target.value as AspectRatio)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {Object.entries(ASPECT_RATIOS).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Background Color"
                  type="color"
                  value={grid.backgroundColor || '#ffffff'}
                  onChange={(e) => updateGrid({ backgroundColor: e.target.value })}
                />
              </div>
            </div>

            {/* Canvas */}
            <GridCanvas
              grid={grid}
              onUpdateSlot={updateSlot}
              selectedSlotId={selectedSlotId}
              onSelectSlot={setSelectedSlotId}
            />

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={addSlot} variant="outline" fullWidth>
                <Plus className="w-4 h-4 mr-2" />
                Add Photo Slot
              </Button>
              <Button onClick={() => setShowPreview(true)} variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Slot Controls */}
        <div className="w-80 border-l bg-gray-50 dark:bg-gray-900 overflow-auto">
          <SlotControls
            slot={selectedSlot}
            slotIndex={selectedSlotIndex}
            totalSlots={grid.slots.length}
            onUpdate={(updates) => selectedSlotId && updateSlot(selectedSlotId, updates)}
            onDelete={() => selectedSlotId && deleteSlot(selectedSlotId)}
            onDuplicate={() => selectedSlotId && duplicateSlot(selectedSlotId)}
            onMoveUp={() => selectedSlotId && moveSlot(selectedSlotId, 'up')}
            onMoveDown={() => selectedSlotId && moveSlot(selectedSlotId, 'down')}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center p-6 border-t">
        <div className="text-sm text-gray-600">
          {grid.slots.length} photo slot{grid.slots.length !== 1 ? 's' : ''}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Grid
          </Button>
        </div>
      </div>
    </Modal>
  );
}
