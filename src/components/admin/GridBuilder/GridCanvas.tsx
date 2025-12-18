import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GridTemplate, GridSlot } from '@/types/grid';
import { cn } from '@/utils/helpers';

type GridCanvasProps = {
  grid: GridTemplate;
  onUpdateSlot: (slotId: string, updates: Partial<GridSlot>) => void;
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string | null) => void;
  photos?: string[];
};

type DragState = {
  slotId: string;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
};

type ResizeState = {
  slotId: string;
  handle: 'nw' | 'ne' | 'sw' | 'se';
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
  startSlotX: number;
  startSlotY: number;
};

export function GridCanvas({
  grid,
  onUpdateSlot,
  selectedSlotId,
  onSelectSlot,
  photos = [],
}: GridCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  // Update canvas size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle slot drag
  const handleSlotMouseDown = (e: React.MouseEvent, slot: GridSlot) => {
    e.stopPropagation();
    if (resizeState) return;

    onSelectSlot(slot.id);

    const rect = canvasRef.current!.getBoundingClientRect();
    setDragState({
      slotId: slot.id,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left - (slot.x / 100) * rect.width,
      offsetY: e.clientY - rect.top - (slot.y / 100) * rect.height,
    });
  };

  // Handle resize handle drag
  const handleResizeMouseDown = (
    e: React.MouseEvent,
    slot: GridSlot,
    handle: ResizeState['handle']
  ) => {
    e.stopPropagation();

    setResizeState({
      slotId: slot.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: slot.width,
      startHeight: slot.height,
      startSlotX: slot.x,
      startSlotY: slot.y,
    });
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left - dragState.offsetX) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragState.offsetY) / rect.height) * 100;

        // Clamp to canvas bounds
        const slot = grid.slots.find((s) => s.id === dragState.slotId)!;
        const clampedX = Math.max(0, Math.min(100 - slot.width, x));
        const clampedY = Math.max(0, Math.min(100 - slot.height, y));

        onUpdateSlot(dragState.slotId, { x: clampedX, y: clampedY });
      }

      if (resizeState && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const deltaX = ((e.clientX - resizeState.startX) / rect.width) * 100;
        const deltaY = ((e.clientY - resizeState.startY) / rect.height) * 100;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;
        let newX = resizeState.startSlotX;
        let newY = resizeState.startSlotY;

        // Calculate new dimensions based on handle
        switch (resizeState.handle) {
          case 'se':
            newWidth = Math.max(10, resizeState.startWidth + deltaX);
            newHeight = Math.max(10, resizeState.startHeight + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(10, resizeState.startWidth - deltaX);
            newHeight = Math.max(10, resizeState.startHeight + deltaY);
            newX = resizeState.startSlotX + deltaX;
            break;
          case 'ne':
            newWidth = Math.max(10, resizeState.startWidth + deltaX);
            newHeight = Math.max(10, resizeState.startHeight - deltaY);
            newY = resizeState.startSlotY + deltaY;
            break;
          case 'nw':
            newWidth = Math.max(10, resizeState.startWidth - deltaX);
            newHeight = Math.max(10, resizeState.startHeight - deltaY);
            newX = resizeState.startSlotX + deltaX;
            newY = resizeState.startSlotY + deltaY;
            break;
        }

        // Clamp to canvas bounds
        newX = Math.max(0, Math.min(100 - newWidth, newX));
        newY = Math.max(0, Math.min(100 - newHeight, newY));
        newWidth = Math.min(100 - newX, newWidth);
        newHeight = Math.min(100 - newY, newHeight);

        onUpdateSlot(resizeState.slotId, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    if (dragState || resizeState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, grid.slots, onUpdateSlot]);

  // Sort slots by zIndex
  const sortedSlots = [...grid.slots].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div
      ref={canvasRef}
      className="relative w-full bg-white rounded-lg shadow-lg overflow-hidden"
      style={{
        aspectRatio: grid.aspectRatio.replace(':', '/'),
        backgroundColor: grid.backgroundColor || '#ffffff',
      }}
      onClick={() => onSelectSlot(null)}
    >
      {/* Background Image */}
      {grid.backgroundImage && (
        <img
          src={grid.backgroundImage}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Grid Slots */}
      {sortedSlots.map((slot, index) => {
        const isSelected = slot.id === selectedSlotId;
        const photo = photos[index];

        return (
          <motion.div
            key={slot.id}
            className={cn(
              'absolute cursor-move transition-shadow',
              isSelected && 'ring-2 ring-primary-500 ring-offset-2'
            )}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${slot.width}%`,
              height: `${slot.height}%`,
              borderRadius: slot.radius ? `${slot.radius}px` : 0,
              zIndex: slot.zIndex || 0,
            }}
            onMouseDown={(e) => handleSlotMouseDown(e, slot)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            {/* Photo or Placeholder */}
            {photo ? (
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ borderRadius: slot.radius ? `${slot.radius}px` : 0 }}
              />
            ) : (
              <div
                className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"
                style={{ borderRadius: slot.radius ? `${slot.radius}px` : 0 }}
              >
                <span className="text-gray-400 text-sm font-medium">
                  Photo {index + 1}
                </span>
              </div>
            )}

            {/* Resize Handles (only when selected) */}
            {isSelected && (
              <>
                {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
                  <div
                    key={handle}
                    className={cn(
                      'absolute w-3 h-3 bg-primary-500 border-2 border-white rounded-full cursor-pointer hover:scale-125 transition-transform',
                      handle === 'nw' && '-top-1.5 -left-1.5 cursor-nw-resize',
                      handle === 'ne' && '-top-1.5 -right-1.5 cursor-ne-resize',
                      handle === 'sw' && '-bottom-1.5 -left-1.5 cursor-sw-resize',
                      handle === 'se' && '-bottom-1.5 -right-1.5 cursor-se-resize'
                    )}
                    onMouseDown={(e) => handleResizeMouseDown(e, slot, handle)}
                  />
                ))}
              </>
            )}

            {/* Slot Label */}
            {isSelected && (
              <div className="absolute -top-6 left-0 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                Slot {index + 1}
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Logo */}
      {grid.logo && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${grid.logo.x}%`,
            top: `${grid.logo.y}%`,
            width: `${grid.logo.width}%`,
            height: `${grid.logo.height}%`,
          }}
        >
          <img
            src={grid.logo.url}
            alt="Logo"
            className="w-full h-full object-contain opacity-80"
          />
        </div>
      )}
    </div>
  );
}
