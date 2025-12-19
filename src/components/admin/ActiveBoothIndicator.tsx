/**
 * ACTIVE BOOTH INDICATOR
 * Shows currently selected booth context in admin UI
 * Enforces booth-first architecture visibility
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Monitor, AlertCircle } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

export function ActiveBoothIndicator() {
  const navigate = useNavigate();
  const { selectedBoothId, selectedBoothName, clearBoothSelection } = useAdminStore();

  if (!selectedBoothId) {
    return (
      <button
        onClick={() => navigate('/admin/machines')}
        className="w-full px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl hover:bg-yellow-500/20 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-xs font-semibold">No Booth Selected</span>
        </div>
        <p className="text-xs text-yellow-400/70 mt-1">
          Click to select a booth
        </p>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 bg-primary-500/10 border border-primary-500/30 rounded-xl"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Monitor className="w-4 h-4 text-primary-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-primary-400">Active Booth</span>
          </div>
          <p className="text-sm font-bold text-white truncate">
            {selectedBoothName || 'Unnamed Booth'}
          </p>
          <p className="text-xs text-gray-400 font-mono truncate">
            ID: {selectedBoothId.slice(0, 12)}...
          </p>
        </div>
        <button
          onClick={clearBoothSelection}
          className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/5"
          title="Clear selection"
        >
          Change
        </button>
      </div>
    </motion.div>
  );
}
