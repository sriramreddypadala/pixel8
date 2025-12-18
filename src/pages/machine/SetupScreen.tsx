import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { StillCountSelector } from '@/components/machine/StillCountSelector';
import { GridSelector } from '@/components/machine/GridSelector';
import { NeonWaves } from '@/components/effects/NeonWaves';
import { ParticleField } from '@/components/effects/ParticleField';
import { useMachineStore } from '@/store/machineStore';
import { useGridStore } from '@/store/gridStore';

export function SetupScreen() {
  const navigate = useNavigate();
  const { startSession } = useMachineStore();
  const { templates, activeGrid } = useGridStore();
  
  const [step, setStep] = useState<'count' | 'grid'>(activeGrid ? 'grid' : 'count');
  const [selectedStillCount, setSelectedStillCount] = useState<number | null>(null);
  const [selectedGridId, setSelectedGridId] = useState<string | null>(null);
  const [copies, setCopies] = useState(1);

  // Get available still counts from enabled templates
  const availableStillCounts = useMemo(() => {
    const counts = [...new Set(
      templates
        .filter(t => t.isEnabled)
        .map(t => t.stillCount)
    )];
    return counts.sort((a, b) => a - b);
  }, [templates]);

  // Filter grids based on selected still count
  const filteredGrids = useMemo(() => {
    if (!selectedStillCount) return [];
    return templates
      .filter(t => t.isEnabled && t.stillCount === selectedStillCount)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [templates, selectedStillCount]);

  const selectedGrid = templates.find(t => t.id === selectedGridId);

  const handleStillCountSelect = (count: number) => {
    setSelectedStillCount(count);
    setSelectedGridId(null);
    setStep('grid');
  };

  const handleGridSelect = (gridId: string) => {
    setSelectedGridId(gridId);
  };

  const handleBack = () => {
    if (step === 'grid') {
      setStep('count');
      setSelectedGridId(null);
    } else {
      navigate('/machine');
    }
  };

  const handleContinue = () => {
    if (!selectedGrid) return;

    startSession();
    navigate('/machine/capture');
  };

  const canContinue = step === 'grid' && selectedGridId !== null;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-fuchsia-900 to-cyan-900" />
      <NeonWaves />
      <ParticleField count={30} colors={['#00f0ff', '#ff00ff', '#8b5cf6']} speed="medium" />
      
      {/* Radial Glows */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-30"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full blur-[120px] opacity-30"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.3, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="relative z-10 w-full max-w-6xl">
        {/* Progress Indicator with Neon Glow */}
        <motion.div 
          className="flex items-center justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div 
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
              step === 'count' 
                ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white border-cyan-400' 
                : 'bg-white/10 text-white/50 border-white/30'
            }`}
            animate={step === 'count' ? {
              boxShadow: [
                '0 0 20px rgba(0,240,255,0.6)',
                '0 0 40px rgba(255,0,255,0.8)',
                '0 0 20px rgba(0,240,255,0.6)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            1
          </motion.div>
          <motion.div 
            className="w-24 h-2 rounded-full overflow-hidden bg-white/20"
            animate={{
              background: step === 'grid' 
                ? 'linear-gradient(90deg, rgba(0,240,255,0.8) 0%, rgba(255,0,255,0.8) 100%)'
                : 'rgba(255,255,255,0.2)'
            }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
              initial={{ width: '0%' }}
              animate={{ width: step === 'grid' ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
          <motion.div 
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-4 ${
              step === 'grid'
                ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white border-cyan-400'
                : 'bg-white/10 text-white/50 border-white/30'
            }`}
            animate={step === 'grid' ? {
              boxShadow: [
                '0 0 20px rgba(0,240,255,0.6)',
                '0 0 40px rgba(255,0,255,0.8)',
                '0 0 20px rgba(0,240,255,0.6)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            2
          </motion.div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'count' ? (
            <motion.div
              key="count"
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border-2 border-white/20"
              style={{
                boxShadow: '0 0 60px rgba(0,240,255,0.2), inset 0 0 60px rgba(255,255,255,0.05)'
              }}
            >
              <StillCountSelector
                selectedCount={selectedStillCount}
                onSelect={handleStillCountSelect}
                availableCounts={availableStillCounts}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border-2 border-white/20" style={{
                boxShadow: '0 0 60px rgba(255,0,255,0.2), inset 0 0 60px rgba(255,255,255,0.05)'
              }}>
                <GridSelector
                  grids={filteredGrids}
                  selectedGridId={selectedGridId}
                  onSelect={handleGridSelect}
                />
              </div>

              {/* Copies & Price */}
              {selectedGrid && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring' }}
                  className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-cyan-400/50"
                  style={{
                    boxShadow: '0 0 40px rgba(0,240,255,0.3), inset 0 0 40px rgba(0,240,255,0.1)'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-white text-2xl font-black mb-4">
                        🎫 NUMBER OF COPIES
                      </label>
                      <div className="flex gap-4">
                        {[1, 2, 3, 4].map((num) => (
                          <motion.button
                            key={num}
                            onClick={() => setCopies(num)}
                            whileHover={{ scale: 1.1, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-20 h-20 rounded-2xl font-black text-3xl transition-all border-4 ${
                              copies === num
                                ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white border-cyan-400'
                                : 'bg-white/10 text-white border-white/30 hover:border-fuchsia-400'
                            }`}
                            style={copies === num ? {
                              boxShadow: '0 0 30px rgba(0,240,255,0.6), 0 0 60px rgba(255,0,255,0.4)'
                            } : {}}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-cyan-300 text-xl font-semibold mb-2">💰 TOTAL PRICE</p>
                      <motion.p 
                        className="text-7xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ₹{selectedGrid.price * copies}
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <motion.div 
          className="flex gap-6 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={handleBack}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-6 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/30 text-white text-xl font-bold flex items-center gap-3 hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
            BACK
          </motion.button>
          
          {step === 'grid' && canContinue && (
            <motion.button
              onClick={handleContinue}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 px-12 py-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 text-white text-2xl font-black flex items-center justify-center gap-4"
              style={{
                boxShadow: '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)'
              }}
            >
              LET'S GO! 🚀
              <ArrowRight className="w-8 h-8" />
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
