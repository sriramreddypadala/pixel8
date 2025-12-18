import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Sparkles, Zap } from 'lucide-react';
import { NeonWaves } from '@/components/effects/NeonWaves';
import { ParticleField } from '@/components/effects/ParticleField';
import { useMachineStore } from '@/store/machineStore';

export function PrintingScreen() {
  const navigate = useNavigate();
  const { session, mode, incrementPrintCount, config } = useMachineStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          incrementPrintCount(session?.copies || 1, mode);
          
          setTimeout(() => {
            if (config?.qrEnabled) {
              navigate('/machine/qr');
            } else {
              navigate('/machine/thankyou');
            }
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [session, mode, incrementPrintCount, config, navigate]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-8">
      {/* Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-fuchsia-900 to-cyan-900" />
      <NeonWaves />
      <ParticleField count={40} colors={['#00f0ff', '#ff00ff', '#8b5cf6', '#fbbf24']} speed="fast" />
      
      {/* Radial Glows */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-30"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full blur-[120px] opacity-30"
        animate={{ scale: [1.3, 1, 1.3], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="relative z-10 text-center max-w-4xl">
        {/* Animated Printer Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="mb-12"
        >
          <motion.div
            className="relative inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Printer with Glow */}
            <motion.div
              animate={{
                filter: [
                  'drop-shadow(0 0 30px rgba(0,240,255,0.6))',
                  'drop-shadow(0 0 50px rgba(255,0,255,0.8))',
                  'drop-shadow(0 0 30px rgba(0,240,255,0.6))',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Printer className="w-48 h-48 text-white" strokeWidth={2} />
            </motion.div>
            
            {/* Paper Coming Out Animation */}
            <motion.div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-40 bg-white rounded-lg shadow-2xl"
              initial={{ y: -40, opacity: 0 }}
              animate={{ 
                y: [0, 20, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                boxShadow: '0 0 30px rgba(0,240,255,0.5)'
              }}
            >
              {/* Sparkles on Paper */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: `${30 + i * 20}%`,
                    left: `${20 + i * 30}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Title with Neon Glow */}
        <motion.h1 
          className="text-7xl font-black text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            textShadow: [
              '0 0 30px rgba(0,240,255,0.8)',
              '0 0 50px rgba(255,0,255,0.8)',
              '0 0 30px rgba(0,240,255,0.8)',
            ]
          }}
          transition={{ 
            opacity: { duration: 0.5 },
            y: { duration: 0.5 },
            textShadow: { duration: 2, repeat: Infinity }
          }}
        >
          ⚡ PRINTING MAGIC ⚡
        </motion.h1>
        
        <motion.p 
          className="text-3xl text-cyan-300 font-light mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your memories are coming to life...
        </motion.p>

        {/* Progress Bar with Flowing Gradient */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative bg-white/10 backdrop-blur-md rounded-full h-12 overflow-hidden border-2 border-white/20">
            <motion.div
              className="h-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                background: 'linear-gradient(90deg, #00f0ff 0%, #ff00ff 50%, #fbbf24 100%)',
                backgroundSize: '200% 100%',
              }}
            >
              {/* Flowing Animation */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                  backgroundSize: '50% 100%',
                }}
              />
              
              {/* Sparkles */}
              {progress > 20 && [
                ...Array(Math.floor(progress / 20))
              ].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${(i + 1) * 20}%` }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Progress Percentage */}
          <motion.p 
            className="text-6xl font-black mt-6"
            animate={{
              scale: [1, 1.05, 1],
              background: [
                'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)',
                'linear-gradient(135deg, #ff00ff 0%, #fbbf24 100%)',
                'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {progress}%
          </motion.p>
        </div>

        {/* Session Info */}
        <motion.div
          className="space-y-4 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            boxShadow: '0 0 40px rgba(0,240,255,0.2), inset 0 0 40px rgba(255,255,255,0.05)'
          }}
        >
          <p className="text-2xl text-white font-semibold">
            📦 Printing {session?.copies} {session?.copies === 1 ? 'copy' : 'copies'}
          </p>
          <p className="text-xl text-cyan-300">
            🎨 Layout: {session?.layout?.name}
          </p>
        </motion.div>

        {/* Fun Loading Messages */}
        <motion.div
          className="mt-8"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-2xl text-white/70 font-light">
            {progress < 30 && '✨ Sprinkling magic dust...'}
            {progress >= 30 && progress < 60 && '🎨 Adding colors...'}
            {progress >= 60 && progress < 90 && '⚡ Almost there...'}
            {progress >= 90 && '🎉 Finalizing your masterpiece!'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
