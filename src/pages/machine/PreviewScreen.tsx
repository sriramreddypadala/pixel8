/**
 * PREVIEW SCREEN
 * Shows captured photos in selected grid layout
 * User confirms before proceeding to payment
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, X, RotateCcw } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { useMachineStore } from '@/store/machineStore';

const backgroundVideo = '/src/assets/backgroundVideo.mp4';

export function PreviewScreen() {
  const navigate = useNavigate();
  const { session, mode } = useMachineStore();

  const capturedPhotos = session?.photos || [];
  const layout = session?.layout;
  const stillCount = (layout as any)?.stillCount || layout?.photoCount || 4;

  const handleConfirm = () => {
    if (mode === 'EVENT') {
      navigate('/machine/printing');
    } else {
      navigate('/machine/payment');
    }
  };

  const handleRetake = () => {
    navigate('/machine/capture');
  };

  const handleCancel = () => {
    navigate('/machine/setup');
  };

  // Calculate grid layout based on photo count
  const getGridLayout = () => {
    switch (stillCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 4:
        return 'grid-cols-2 grid-rows-2';
      case 8:
        return 'grid-cols-4 grid-rows-2';
      default:
        return 'grid-cols-2 grid-rows-2';
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      <VideoBackground
        videoSrc={backgroundVideo}
        overlayOpacity={0.8}
        enableVignette={true}
      />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-black text-white mb-4">
            ✨ Preview Your Photos ✨
          </h1>
          <p className="text-2xl text-cyan-300 font-light">
            Love them? Let's print! Want to retake? No problem!
          </p>
        </motion.div>

        {/* Photo Grid Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div
            className={`grid ${getGridLayout()} gap-4 bg-white/5 backdrop-blur-xl border-4 border-white/20 rounded-3xl p-8`}
            style={{
              boxShadow: '0 0 60px rgba(0,240,255,0.3), 0 0 120px rgba(255,0,255,0.2)',
            }}
          >
            {capturedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white/30"
                style={{
                  boxShadow: '0 0 20px rgba(0,240,255,0.4)',
                }}
              >
                <img
                  src={photo.dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Photo Number Badge */}
                <div className="absolute top-2 right-2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6"
        >
          {/* Cancel Button */}
          <GlassButton
            onClick={handleCancel}
            variant="secondary"
            className="px-8 py-6 text-xl"
          >
            <X className="w-6 h-6 mr-2" />
            <span>Cancel</span>
          </GlassButton>

          {/* Retake Button */}
          <GlassButton
            onClick={handleRetake}
            variant="secondary"
            className="px-8 py-6 text-xl"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            <span>Retake Photos</span>
          </GlassButton>

          {/* Confirm Button */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div
              className="px-12 py-6 text-2xl font-black rounded-2xl bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 backdrop-blur-xl border-2 border-cyan-400 cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-white"
              onClick={handleConfirm}
              style={{
                boxShadow: '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)',
              }}
            >
              <Check className="w-8 h-8 mr-3" />
              <span>Perfect! Continue</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xl text-white/60 mt-8"
        >
          {mode === 'EVENT' 
            ? '🎉 Event mode - Printing for free!'
            : '💳 Ready to pay and print your memories!'}
        </motion.p>
      </div>
    </div>
  );
}
