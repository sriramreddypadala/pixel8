import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Zap, Sparkles } from 'lucide-react';
import { CountdownTimer } from '@/components/machine/CountdownTimer';
import { PhotoPreview } from '@/components/machine/PhotoPreview';
import { useMachineStore } from '@/store/machineStore';
import { generatePhotoId } from '@/utils/helpers';

export function CaptureScreen() {
  const navigate = useNavigate();
  const { session, addCapturedPhoto, removeCapturedPhoto, mode } = useMachineStore();
  const [showCountdown, setShowCountdown] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalFrames = session?.layout?.photoCount || 4;
  const capturedPhotos = session?.photos || [];

  const capturePhoto = useCallback(() => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    
    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      
      addCapturedPhoto({
        id: generatePhotoId(),
        dataUrl,
        timestamp: Date.now(),
        frameNumber: currentFrame + 1,
      });
      
      setCurrentFrame(currentFrame + 1);
    }
  }, [currentFrame, addCapturedPhoto]);

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowFlash(true);
    
    setTimeout(() => {
      capturePhoto();
      setShowFlash(false);
    }, 100);
  };

  const handleTakePhoto = () => {
    setShowCountdown(true);
  };

  const handleRetake = (photoId: string) => {
    removeCapturedPhoto(photoId);
    setCurrentFrame(currentFrame - 1);
  };

  const handleContinue = () => {
    if (mode === 'EVENT') {
      navigate('/machine/printing');
    } else {
      navigate('/machine/payment');
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Epic Flash Effect */}
      {showFlash && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 0.5, times: [0, 0.1, 0.3, 1] }}
            className="absolute inset-0 bg-white z-30"
          />
          {/* Flash Burst */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="w-full h-full bg-gradient-radial from-cyan-400 via-fuchsia-400 to-transparent" />
          </motion.div>
          {/* Light Rays */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-t from-transparent via-white to-transparent origin-bottom z-30"
              style={{
                transform: `rotate(${i * 45}deg)`,
              }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            />
          ))}
        </>
      )}

      {/* Neon Frame Around Camera */}
      <motion.div
        className="absolute inset-8 border-4 rounded-3xl pointer-events-none z-20"
        style={{
          borderImage: 'linear-gradient(135deg, #00f0ff, #ff00ff, #8b5cf6) 1',
        }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(0,240,255,0.5), inset 0 0 30px rgba(0,240,255,0.2)',
            '0 0 50px rgba(255,0,255,0.7), inset 0 0 50px rgba(255,0,255,0.3)',
            '0 0 30px rgba(0,240,255,0.5), inset 0 0 30px rgba(0,240,255,0.2)',
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Corner Decorations */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <motion.div
          key={corner}
          className={`absolute w-16 h-16 border-4 border-cyan-400 z-20 ${
            corner.includes('top') ? 'top-12' : 'bottom-12'
          } ${
            corner.includes('left') ? 'left-12' : 'right-12'
          } ${
            corner.includes('top') && corner.includes('left') ? 'border-r-0 border-b-0 rounded-tl-2xl' :
            corner.includes('top') && corner.includes('right') ? 'border-l-0 border-b-0 rounded-tr-2xl' :
            corner.includes('bottom') && corner.includes('left') ? 'border-r-0 border-t-0 rounded-bl-2xl' :
            'border-l-0 border-t-0 rounded-br-2xl'
          }`}
          animate={{
            boxShadow: [
              '0 0 20px rgba(0,240,255,0.8)',
              '0 0 40px rgba(255,0,255,0.8)',
              '0 0 20px rgba(0,240,255,0.8)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: corner.length * 0.1 }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 z-10" />

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Header with Neon Glow */}
        <div className="p-8">
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.h1 
                className="text-6xl font-black mb-2"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(0,240,255,0.8)',
                    '0 0 40px rgba(255,0,255,0.8)',
                    '0 0 20px rgba(0,240,255,0.8)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📸 STRIKE A POSE!
              </motion.h1>
              <p className="text-3xl text-cyan-300 font-semibold">
                Photo {capturedPhotos.length + 1} of {totalFrames}
              </p>
            </motion.div>
            
            {/* Progress Dots with Glow */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {[...Array(totalFrames)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-6 h-6 rounded-full border-4 ${
                    i < capturedPhotos.length
                      ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 border-cyan-400'
                      : 'bg-white/10 border-white/30'
                  }`}
                  animate={i < capturedPhotos.length ? {
                    boxShadow: [
                      '0 0 20px rgba(0,240,255,0.8)',
                      '0 0 30px rgba(255,0,255,0.8)',
                      '0 0 20px rgba(0,240,255,0.8)',
                    ]
                  } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  whileHover={{ scale: 1.2 }}
                >
                  {i < capturedPhotos.length && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Center Action Button */}
        <div className="flex-1 flex items-center justify-center">
          {capturedPhotos.length < totalFrames ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleTakePhoto}
              className="relative w-48 h-48 rounded-full flex items-center justify-center"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)',
                  '0 0 60px rgba(255,0,255,0.8), 0 0 100px rgba(0,240,255,0.6)',
                  '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                background: 'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)',
              }}
            >
              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-8 border-white"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.8, 0],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              
              <Camera className="w-24 h-24 text-white" strokeWidth={3} />
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="mb-8"
              >
                <Zap className="w-32 h-32 text-yellow-400 mx-auto" style={{
                  filter: 'drop-shadow(0 0 30px rgba(251,191,36,0.8))'
                }} />
              </motion.div>
              <motion.p 
                className="text-white text-6xl font-black mb-8"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(251,191,36,0.8)',
                    '0 0 40px rgba(251,191,36,1)',
                    '0 0 20px rgba(251,191,36,0.8)',
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎉 AMAZING!
              </motion.p>
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-16 py-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 text-white text-3xl font-black"
                style={{
                  boxShadow: '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)'
                }}
              >
                CONTINUE 🚀
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Photo Thumbnails at Bottom */}
        <div className="p-8">
          <motion.div 
            className="flex gap-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AnimatePresence>
              {capturedPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', damping: 15 }}
                  whileHover={{ scale: 1.1, y: -10 }}
                  className="relative"
                >
                  <PhotoPreview
                    photo={photo}
                    index={index}
                    onRetake={() => handleRetake(photo.id)}
                    onRemove={() => handleRetake(photo.id)}
                  />
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(0,240,255,0.5)',
                        '0 0 30px rgba(255,0,255,0.7)',
                        '0 0 20px rgba(0,240,255,0.5)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {showCountdown && (
        <CountdownTimer onComplete={handleCountdownComplete} />
      )}
    </div>
  );
}
