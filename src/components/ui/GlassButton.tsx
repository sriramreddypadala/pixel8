/**
 * GLASS BUTTON COMPONENT
 * Premium frosted glass button for video-overlay UI
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  pulse?: boolean;
}

const variantStyles = {
  primary: 'bg-white/20 hover:bg-white/30 border-white/30',
  secondary: 'bg-white/10 hover:bg-white/20 border-white/20',
  ghost: 'bg-white/5 hover:bg-white/15 border-white/10',
};

const sizeStyles = {
  sm: 'px-6 py-3 text-base',
  md: 'px-10 py-4 text-lg',
  lg: 'px-16 py-6 text-2xl',
  xl: 'px-20 py-8 text-4xl',
};

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  pulse = false,
}: GlassButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        border rounded-2xl
        backdrop-blur-xl
        font-bold text-white
        transition-all duration-300
        shadow-lg shadow-black/40
        hover:shadow-xl hover:shadow-white/10
        active:scale-95
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      animate={pulse ? {
        boxShadow: [
          '0 10px 40px rgba(255,255,255,0.1)',
          '0 10px 60px rgba(255,255,255,0.2)',
          '0 10px 40px rgba(255,255,255,0.1)',
        ],
      } : {}}
      transition={pulse ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        style={{ pointerEvents: 'none' }}
      />
      
      <div className="flex items-center justify-center gap-3">
        {Icon && <Icon className="w-6 h-6" />}
        {children}
      </div>

      {pulse && (
        <motion.div
          className="absolute inset-0 border-2 border-white rounded-2xl"
          animate={{
            scale: [1, 1.1],
            opacity: [0.5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
}
