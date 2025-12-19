/**
 * MACHINES MANAGEMENT PAGE
 * Central control panel for all photo booths
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Wifi, WifiOff, Clock, Printer, Settings } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { BoothControlPanel } from '@/components/admin/BoothControlPanel';
import { useAdminStore } from '@/store/adminStore';
import { MOCK_BOOTHS } from '@/utils/mockBoothData';
import type { BoothInfo, BoothConfig } from '@/types/booth.types';

export function MachinesPage() {
  const [booths, setBooths] = useState<BoothInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooth, setSelectedBooth] = useState<BoothInfo | null>(null);
  const { setSelectedBooth: setAdminBooth } = useAdminStore();

  useEffect(() => {
    setTimeout(() => {
      setBooths(MOCK_BOOTHS);
      setLoading(false);
    }, 500);
  }, []);

  const handleSaveConfig = (config: Partial<BoothConfig>) => {
    setBooths(prev => prev.map(booth => {
      if (booth.identity.boothId === config.boothId) {
        const isInSession = booth.status.isInSession;
        return {
          ...booth,
          config: { ...booth.config, ...config },
          status: {
            ...booth.status,
            hasPendingConfig: isInSession,
          },
        };
      }
      return booth;
    }));
    
    if (selectedBooth && selectedBooth.identity.boothId === config.boothId) {
      const updatedBooth = booths.find(b => b.identity.boothId === config.boothId);
      if (updatedBooth) {
        setSelectedBooth({
          ...updatedBooth,
          config: { ...updatedBooth.config, ...config },
        });
      }
    }
  };

  const handleSelectBooth = (booth: BoothInfo) => {
    setSelectedBooth(booth);
    // Update global admin context (booth-first architecture)
    setAdminBooth(booth.identity.boothId, booth.identity.boothName);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400';
      case 'in-session': return 'text-blue-400';
      case 'offline': return 'text-gray-500';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'offline' ? WifiOff : Wifi;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'in-session': return 'In Session';
      case 'offline': return 'Offline';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Machines Management</h1>
          <p className="text-gray-400 text-lg">Central control panel for all photo booths</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Booths</span>
              <Monitor className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{booths.length}</div>
          </GlassPanel>

          <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Online</span>
              <Wifi className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-3xl font-black text-green-400">
              {booths.filter(b => b.status.status === 'online' || b.status.status === 'in-session').length}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">In Session</span>
              <Printer className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-blue-400">
              {booths.filter(b => b.status.status === 'in-session').length}
            </div>
          </GlassPanel>

          <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Offline</span>
              <WifiOff className="w-5 h-5 text-gray-500" />
            </div>
            <div className="text-3xl font-black text-gray-500">
              {booths.filter(b => b.status.status === 'offline').length}
            </div>
          </GlassPanel>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        ) : booths.length === 0 ? (
          <GlassPanel className="p-12 rounded-2xl text-center" blur="medium" opacity={0.7}>
            <Monitor className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Booths Found</h3>
            <p className="text-gray-400">Register your first photo booth to get started</p>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {booths.map((booth, index) => {
              const StatusIcon = getStatusIcon(booth.status.status);
              return (
                <motion.div
                  key={booth.identity.boothId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassPanel
                    className="p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform"
                    blur="medium"
                    opacity={0.7}
                    onClick={() => handleSelectBooth(booth)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-white mb-1">
                          {booth.identity.boothName}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          ID: {booth.identity.boothId.slice(0, 8)}...
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(booth.status.status)}`} />
                        <span className={`text-sm font-semibold ${getStatusColor(booth.status.status)}`}>
                          {getStatusLabel(booth.status.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Mode</span>
                        <span className="text-sm font-semibold text-white capitalize">
                          {booth.status.currentMode}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Active Grid</span>
                        <span className="text-sm font-semibold text-white">
                          {booth.status.activeGridId.slice(0, 12)}...
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Total Prints</span>
                        <span className="text-sm font-semibold text-white">
                          {booth.stats?.totalSessions || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Last Seen</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-500" />
                          <span className="text-sm font-semibold text-white">
                            {formatLastSeen(booth.status.lastHeartbeat)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {booth.status.hasPendingConfig && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-yellow-400">
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-semibold">Pending Configuration Update</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Will apply after current session ends
                        </p>
                      </div>
                    )}

                    {booth.status.isInSession && booth.status.sessionStartTime && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-blue-400">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                          <span className="text-sm font-semibold">Session Active</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Started {formatLastSeen(booth.status.sessionStartTime)}
                        </p>
                      </div>
                    )}
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {selectedBooth && (
            <BoothControlPanel
              booth={selectedBooth}
              onClose={() => setSelectedBooth(null)}
              onSave={handleSaveConfig}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
