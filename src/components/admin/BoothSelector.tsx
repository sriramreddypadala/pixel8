/**
 * BOOTH SELECTOR MODAL
 * Mandatory booth selection for admin portal
 * Enforces booth-first architecture
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Wifi, WifiOff, Search, X } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useAdminStore } from '@/store/adminStore';
import { MOCK_BOOTHS } from '@/utils/mockBoothData';
import type { BoothInfo } from '@/types/booth.types';

interface BoothSelectorProps {
  isOpen: boolean;
  onClose?: () => void;
  mandatory?: boolean;
}

export function BoothSelector({ isOpen, onClose, mandatory = false }: BoothSelectorProps) {
  const [booths, setBooths] = useState<BoothInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { setSelectedBooth } = useAdminStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setBooths(MOCK_BOOTHS);
        setLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const filteredBooths = booths.filter(booth =>
    booth.identity.boothName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booth.identity.boothId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectBooth = (booth: BoothInfo) => {
    setSelectedBooth(booth.identity.boothId, booth.identity.boothName);
    if (onClose && !mandatory) {
      onClose();
    }
  };

  const handleClose = () => {
    if (!mandatory && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-3xl max-h-[80vh] flex flex-col"
        >
          <GlassPanel className="p-6 rounded-2xl" blur="heavy" opacity={0.95}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">
                  Select Booth
                </h2>
                <p className="text-sm text-gray-400">
                  {mandatory 
                    ? 'Choose a booth to manage (required)'
                    : 'Choose a booth to switch context'}
                </p>
              </div>
              {!mandatory && onClose && (
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              )}
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 transition-colors"
              />
            </div>

            <div className="overflow-y-auto max-h-[50vh] space-y-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              ) : filteredBooths.length === 0 ? (
                <div className="text-center py-12">
                  <Monitor className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No booths found</p>
                </div>
              ) : (
                filteredBooths.map((booth) => {
                  const isOnline = booth.status.status === 'online' || booth.status.status === 'in-session';
                  const StatusIcon = isOnline ? Wifi : WifiOff;

                  return (
                    <motion.button
                      key={booth.identity.boothId}
                      onClick={() => handleSelectBooth(booth)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary-500/50 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-white">
                              {booth.identity.boothName}
                            </h3>
                            <StatusIcon 
                              className={`w-4 h-4 ${isOnline ? 'text-green-400' : 'text-gray-500'}`}
                            />
                          </div>
                          <p className="text-xs text-gray-500 font-mono">
                            {booth.identity.boothId}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="capitalize">Mode: {booth.status.currentMode}</span>
                            <span>Sessions: {booth.stats?.totalSessions || 0}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          isOnline 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {isOnline ? 'Online' : 'Offline'}
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>

            {mandatory && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-xs text-yellow-400 text-center">
                  ⚠️ Booth selection is required to access admin features
                </p>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
