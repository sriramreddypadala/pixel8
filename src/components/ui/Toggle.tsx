import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { toggleVariants } from '@/utils/motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, label, disabled = false }: ToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(!enabled)}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        className={cn(
          'relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <motion.span
          className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
          variants={toggleVariants}
          animate={enabled ? 'on' : 'off'}
        />
      </motion.button>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </div>
  );
}
