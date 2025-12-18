import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

type ProgressBarProps = {
  progress: number; // 0-100
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

const variantColors = {
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
};

export function ProgressBar({
  progress,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn(
        'relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
        sizeClasses[size]
      )}>
        <motion.div
          className={cn('h-full rounded-full', variantColors[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mt-2"
        >
          {Math.round(clampedProgress)}%
        </motion.div>
      )}
    </div>
  );
}
