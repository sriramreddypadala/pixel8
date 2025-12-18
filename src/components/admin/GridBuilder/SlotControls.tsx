import { Trash2, Copy, MoveUp, MoveDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { GridSlot } from '@/types/grid';

type SlotControlsProps = {
  slot: GridSlot | null;
  slotIndex: number;
  totalSlots: number;
  onUpdate: (updates: Partial<GridSlot>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export function SlotControls({
  slot,
  slotIndex,
  totalSlots,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
}: SlotControlsProps) {
  if (!slot) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a slot to edit its properties
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Slot {slotIndex + 1}</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onMoveUp}
            disabled={slotIndex === 0}
            title="Move Up"
          >
            <MoveUp className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onMoveDown}
            disabled={slotIndex === totalSlots - 1}
            title="Move Down"
          >
            <MoveDown className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDuplicate}
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Position */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Position
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="X (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={slot.x.toFixed(1)}
            onChange={(e) => onUpdate({ x: parseFloat(e.target.value) })}
          />
          <Input
            label="Y (%)"
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={slot.y.toFixed(1)}
            onChange={(e) => onUpdate({ y: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Size
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Width (%)"
            type="number"
            min="10"
            max="100"
            step="0.1"
            value={slot.width.toFixed(1)}
            onChange={(e) => onUpdate({ width: parseFloat(e.target.value) })}
          />
          <Input
            label="Height (%)"
            type="number"
            min="10"
            max="100"
            step="0.1"
            value={slot.height.toFixed(1)}
            onChange={(e) => onUpdate({ height: parseFloat(e.target.value) })}
          />
        </div>
      </div>

      {/* Styling */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Styling
        </h4>
        <Input
          label="Border Radius (px)"
          type="number"
          min="0"
          max="100"
          value={slot.radius || 0}
          onChange={(e) => onUpdate({ radius: parseInt(e.target.value) })}
        />
        <Input
          label="Z-Index (Layer)"
          type="number"
          min="0"
          max="10"
          value={slot.zIndex || 0}
          onChange={(e) => onUpdate({ zIndex: parseInt(e.target.value) })}
        />
      </div>

      {/* Quick Presets */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quick Presets
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate({ radius: 0 })}
          >
            Square
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate({ radius: 12 })}
          >
            Rounded
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate({ radius: 999 })}
          >
            Circle
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdate({ width: 45, height: 45 })}
          >
            Square Size
          </Button>
        </div>
      </div>
    </div>
  );
}
