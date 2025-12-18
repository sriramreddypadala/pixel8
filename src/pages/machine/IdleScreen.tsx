import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, Zap } from 'lucide-react';
import { AdminLockButton } from '@/components/machine/AdminLockButton';
import { ParticleField } from '@/components/effects/ParticleField';
import { NeonWaves } from '@/components/effects/NeonWaves';

export function IdleScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/machine/setup');
  };

  return (
    <div 
      className="relative min-h-screen bg-black overflow-hidden cursor-pointer"
      onClick={handleStart}
    >
      {/* Animated Neon Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-fuchsia-900 to-cyan-900" />
      <NeonWaves />
      <ParticleField count={40} colors={['#00f0ff', '#ff00ff', '#8b5cf6', '#ec4899']} speed="slow" />

      {/* Radial Glow Effects */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[120px] opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500 rounded-full blur-[120px] opacity-30"
        animate={{
          scale: [1.3, 1, 1.3],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AdminLockButton onUnlock={() => navigate('/admin')} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-8">
        {/* Main Logo with Neon Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: 'spring' }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-6 mb-8"
            animate={{ 
              filter: [
                'drop-shadow(0 0 20px rgba(0,240,255,0.5))',
                'drop-shadow(0 0 40px rgba(255,0,255,0.7))',
                'drop-shadow(0 0 20px rgba(0,240,255,0.5))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Camera className="w-24 h-24 text-cyan-400" />
            <motion.h1
              className="text-9xl font-black bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-400 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 200%' }}
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            >
              PIXXEL8
            </motion.h1>
            <Sparkles className="w-24 h-24 text-fuchsia-400" />
          </motion.div>
          
          <motion.p
            className="text-5xl font-bold text-white mb-4"
            animate={{ 
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎉 PHOTO BOOTH 🎉
          </motion.p>
          <motion.p
            className="text-3xl text-cyan-300 font-light tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            CREATE • CAPTURE • CELEBRATE
          </motion.p>
        </motion.div>

        {/* Pulsing CTA Button */}
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-20"
        >
          <motion.div 
            className="relative px-20 py-10 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-violet-500 rounded-full"
            animate={{
              boxShadow: [
                '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)',
                '0 0 60px rgba(255,0,255,0.8), 0 0 100px rgba(0,240,255,0.6)',
                '0 0 40px rgba(0,240,255,0.6), 0 0 80px rgba(255,0,255,0.4)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.p 
              className="text-6xl font-black text-white tracking-wide"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              TAP TO START
            </motion.p>
            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 border-4 border-white rounded-full"
              animate={{
                scale: [1, 1.5],
                opacity: [0.8, 0],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          className="absolute bottom-20 flex gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: Zap, text: 'INSTANT PRINTS', color: 'from-yellow-400 to-orange-500' },
            { icon: Camera, text: 'FUN LAYOUTS', color: 'from-cyan-400 to-blue-500' },
            { icon: Sparkles, text: 'DIGITAL COPIES', color: 'from-fuchsia-400 to-pink-500' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className={`px-8 py-4 bg-gradient-to-r ${feature.color} rounded-full flex items-center gap-3`}
              animate={{ 
                y: [0, -8, 0],
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 30px rgba(255,255,255,0.5)',
                  '0 0 20px rgba(255,255,255,0.3)',
                ]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.3,
                ease: 'easeInOut'
              }}
            >
              <feature.icon className="w-6 h-6 text-white" />
              <span className="text-xl font-bold text-white">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Light Streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-transparent via-white to-transparent"
            style={{
              width: '200px',
              left: '-200px',
              top: `${(i + 1) * 12}%`,
              opacity: 0.3,
            }}
            animate={{
              x: ['0vw', '120vw'],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    </div>
  );
}
