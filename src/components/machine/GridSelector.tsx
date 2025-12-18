import { motion } from 'framer-motion';
import { Check, Image as ImageIcon, Sparkles, Star } from 'lucide-react';
import type { GridTemplate } from '@/types/grid';
import { cn, formatCurrency } from '@/utils/helpers';

type GridSelectorProps = {
  grids: GridTemplate[];
  selectedGridId: string | null;
  onSelect: (gridId: string) => void;
};

export function GridSelector({
  grids,
  selectedGridId,
  onSelect,
}: GridSelectorProps) {
  if (grids.length === 0) {
    return (
      <motion.div 
        className="text-center py-16"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <ImageIcon className="w-24 h-24 text-white/40 mx-auto mb-6" />
        <p className="text-3xl text-white/60 font-light">
          No layouts available for this photo count
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h2 
          className="text-6xl font-black text-white mb-4 flex items-center justify-center gap-4"
          animate={{ 
            textShadow: [
              '0 0 20px rgba(255,0,255,0.5)',
              '0 0 40px rgba(0,240,255,0.7)',
              '0 0 20px rgba(255,0,255,0.5)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Star className="w-12 h-12 text-yellow-400" />
          CHOOSE YOUR LAYOUT
          <Star className="w-12 h-12 text-yellow-400" />
        </motion.h2>
        <p className="text-2xl text-fuchsia-300 font-light tracking-wide">
          Pick your favorite style!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {grids.map((grid) => {
          const isSelected = selectedGridId === grid.id;

          return (
            <motion.button
              key={grid.id}
              onClick={() => onSelect(grid.id)}
              whileHover={{ 
                scale: 1.05,
                y: -12,
                rotateY: 5,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              animate={isSelected ? {
                y: [0, -10, 0],
              } : {}}
              transition={isSelected ? { duration: 2, repeat: Infinity } : {}}
              className={cn(
                'relative rounded-3xl border-4 transition-all duration-300',
                'overflow-hidden backdrop-blur-md',
                isSelected
                  ? 'bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border-cyan-400'
                  : 'bg-white/10 border-white/30 hover:border-fuchsia-400'
              )}
              style={isSelected ? {
                boxShadow: '0 0 50px rgba(0,240,255,0.7), 0 0 100px rgba(255,0,255,0.5), 0 20px 60px rgba(0,0,0,0.5)',
                transformStyle: 'preserve-3d',
              } : {
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Selection Indicator with Sparkle */}
              {isSelected && (
                <>
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{ 
                      scale: { duration: 1, repeat: Infinity },
                      rotate: { duration: 2, repeat: Infinity, ease: 'linear' }
                    }}
                    className="absolute top-4 right-4 z-20 w-16 h-16 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: '0 0 30px rgba(0,240,255,0.9), 0 0 60px rgba(255,0,255,0.7)'
                    }}
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={4} />
                  </motion.div>
                  {/* Corner Sparkles */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute z-10"
                      style={{
                        top: i < 2 ? '10px' : 'auto',
                        bottom: i >= 2 ? '10px' : 'auto',
                        left: i % 2 === 0 ? '10px' : 'auto',
                        right: i % 2 === 1 ? '10px' : 'auto',
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  ))}
                </>
              )}

              {/* Grid Preview with Glow */}
              <div
                className="relative w-full p-6"
                style={{
                  aspectRatio: grid.aspectRatio.replace(':', '/'),
                  backgroundColor: grid.backgroundColor || '#1a1a2e',
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(0,240,255,0.1) 0%, rgba(255,0,255,0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                }}
              >
                {/* Render Slot Placeholders with Animation */}
                {grid.slots.map((slot, index) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotate: 0,
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ delay: index * 0.08, type: 'spring' }}
                    className="absolute flex items-center justify-center border-2"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: `${slot.width}%`,
                      height: `${slot.height}%`,
                      borderRadius: slot.radius ? `${slot.radius}px` : 0,
                      zIndex: slot.zIndex || 0,
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(0,240,255,0.3) 0%, rgba(255,0,255,0.3) 100%)'
                        : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                      borderColor: isSelected ? 'rgba(0,240,255,0.5)' : 'rgba(255,255,255,0.2)',
                      boxShadow: isSelected ? '0 0 10px rgba(0,240,255,0.3)' : 'none',
                    }}
                  >
                    <ImageIcon 
                      className={cn(
                        'w-6 h-6',
                        isSelected ? 'text-cyan-300' : 'text-white/40'
                      )} 
                    />
                  </motion.div>
                ))}

                {/* Logo Preview */}
                {grid.logo && (
                  <div
                    className="absolute opacity-30"
                    style={{
                      left: `${grid.logo.x}%`,
                      top: `${grid.logo.y}%`,
                      width: `${grid.logo.width}%`,
                      height: `${grid.logo.height}%`,
                    }}
                  >
                    <div className="w-full h-full bg-gray-500 rounded" />
                  </div>
                )}
              </div>

              {/* Grid Info with Neon Text */}
              <div className="p-6 text-left backdrop-blur-sm bg-black/30">
                <motion.h3 
                  className="text-2xl font-black text-white mb-2"
                  animate={isSelected ? {
                    textShadow: [
                      '0 0 10px rgba(0,240,255,0.8)',
                      '0 0 20px rgba(255,0,255,0.8)',
                      '0 0 10px rgba(0,240,255,0.8)',
                    ]
                  } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {grid.name}
                </motion.h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg text-cyan-300 font-semibold">
                    📷 {grid.stillCount} {grid.stillCount === 1 ? 'photo' : 'photos'}
                  </span>
                  <motion.span 
                    className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                    animate={isSelected ? {
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    {formatCurrency(grid.price)}
                  </motion.span>
                </div>
              </div>

              {/* Pulsing Border Glow */}
              {isSelected && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.2) 0%, transparent 70%)'
                    }}
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  {/* Rotating Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-fuchsia-400 pointer-events-none"
                    style={{ borderStyle: 'dashed' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                </>
              )}
              
              {/* Hover Ripple */}
              {!isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-white/50 pointer-events-none"
                  initial={{ scale: 1, opacity: 0 }}
                  whileHover={{
                    scale: [1, 1.1],
                    opacity: [0.5, 0],
                  }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
      
      {/* Fun Instruction */}
      <motion.p
        className="text-center text-2xl text-white/70 font-light"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ⚡ Tap your favorite layout ⚡
      </motion.p>
    </div>
  );
}
