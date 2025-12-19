import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { StillCountSelector } from '@/components/machine/StillCountSelector';
import { GridSelector } from '@/components/machine/GridSelector';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import { useMachineStore } from '@/store/machineStore';
import { useGridStore } from '@/store/gridStore';

const backgroundVideo = '/src/assets/backgroundVideo.mp4';

export function SetupScreen() {
  const navigate = useNavigate();
  const { startSession } = useMachineStore();
  const { templates } = useGridStore();
  
  const [step, setStep] = useState<'count' | 'grid'>('count');
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
    // Set the selected grid layout in session
    const { setSessionLayout } = useMachineStore.getState();
    // Convert GridTemplate to PhotoLayout format if needed
    const layoutData: any = selectedGrid;
    setSessionLayout(layoutData);
    
    navigate('/machine/capture');
  };

  const canContinue = step === 'grid' && selectedGridId !== null;

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        videoSrc={backgroundVideo}
        overlayOpacity={0.7}
        enableVignette={true}
      />
      
      <motion.div
        className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <div className="relative z-20 w-full max-w-6xl">
        <motion.div 
          className="flex items-center justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassPanel
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-2 ${
              step === 'count' ? 'border-white/60' : 'border-white/20'
            }`}
            blur="medium"
            opacity={step === 'count' ? 0.9 : 0.5}
            glow={step === 'count'}
          >
            1
          </GlassPanel>
          <div className="w-24 h-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-white/60"
              initial={{ width: '0%' }}
              animate={{ width: step === 'grid' ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <GlassPanel
            className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black border-2 ${
              step === 'grid' ? 'border-white/60' : 'border-white/20'
            }`}
            blur="medium"
            opacity={step === 'grid' ? 0.9 : 0.5}
            glow={step === 'grid'}
          >
            2
          </GlassPanel>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'count' ? (
            <motion.div
              key="count"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
            >
              <GlassPanel
                className="rounded-3xl p-10"
                blur="heavy"
                opacity={0.85}
                border={true}
                glow={true}
              >
                <StillCountSelector
                  selectedCount={selectedStillCount}
                  onSelect={handleStillCountSelect}
                  availableCounts={availableStillCounts}
                />
              </GlassPanel>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <GlassPanel
                className="rounded-3xl p-10"
                blur="heavy"
                opacity={0.85}
                border={true}
                glow={true}
              >
                <GridSelector
                  grids={filteredGrids}
                  selectedGridId={selectedGridId}
                  onSelect={handleGridSelect}
                />
              </GlassPanel>

              {/* Copies & Price */}
              {selectedGrid && (
                <GlassPanel
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-3xl p-8"
                  blur="heavy"
                  opacity={0.85}
                  border={true}
                  glow={true}
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
                </GlassPanel>
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
          <GlassButton
            onClick={handleBack}
            variant="secondary"
            size="lg"
            icon={ArrowLeft}
            className="px-10"
          >
            BACK
          </GlassButton>
          
          {step === 'grid' && canContinue && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1"
            >
              <GlassButton
                onClick={handleContinue}
                variant="primary"
                size="lg"
                pulse={true}
                className="w-full text-2xl font-black"
              >
                LET'S GO! 🚀 <ArrowRight className="w-8 h-8 ml-2" />
              </GlassButton>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
