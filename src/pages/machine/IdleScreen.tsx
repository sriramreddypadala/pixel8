import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Camera, Zap } from 'lucide-react';
import { AdminLockButton } from '@/components/machine/AdminLockButton';
import { VideoBackground } from '@/components/effects/VideoBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';

const backgroundVideo = '/src/assets/backgroundVideo.mp4';

export function IdleScreen() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/machine/setup');
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <VideoBackground
        videoSrc={backgroundVideo}
        overlayOpacity={0.65}
        enableVignette={true}
      />

      <motion.div
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <AdminLockButton onUnlock={() => navigate('/admin')} />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-white px-8">
        <GlassPanel
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="px-16 py-12 rounded-3xl text-center max-w-4xl"
          blur="heavy"
          opacity={0.8}
          glow={true}
        >
          <motion.div
            className="flex items-center justify-center gap-8 mb-8"
            animate={{
              filter: [
                'drop-shadow(0 4px 12px rgba(255,255,255,0.3))',
                'drop-shadow(0 6px 20px rgba(255,255,255,0.5))',
                'drop-shadow(0 4px 12px rgba(255,255,255,0.3))',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Camera className="w-20 h-20 text-white" />
            <h1
              className="text-8xl font-black text-white tracking-tight"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}
            >
              PIXXEL8
            </h1>
            <Sparkles className="w-20 h-20 text-white" />
          </motion.div>
          
          <p className="text-3xl font-bold text-white/90 mb-3">
            PHOTO BOOTH
          </p>
          <p className="text-xl text-white/70 tracking-widest">
            CREATE • CAPTURE • CELEBRATE
          </p>
        </GlassPanel>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16"
        >
          <GlassButton
            onClick={handleStart}
            variant="primary"
            size="xl"
            pulse={true}
            className="font-black tracking-wider"
          >
            TAP TO START
          </GlassButton>
        </motion.div>

        <motion.div
          className="absolute bottom-16 flex flex-wrap justify-center gap-4 max-w-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {[
            { icon: Zap, text: 'INSTANT PRINTS' },
            { icon: Camera, text: 'FUN LAYOUTS' },
            { icon: Sparkles, text: 'DIGITAL COPIES' },
          ].map((feature, i) => (
            <GlassPanel
              key={i}
              className="px-8 py-4 rounded-full flex items-center gap-3"
              blur="medium"
              opacity={0.6}
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut'
              }}
            >
              <feature.icon className="w-6 h-6 text-white" />
              <span className="text-lg font-semibold text-white/90">{feature.text}</span>
            </GlassPanel>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
