/**
 * BOOTH LIST PAGE - Admin view of all booths
 * Enterprise-grade multi-booth management
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Monitor, Circle, Clock, AlertCircle, Settings } from 'lucide-react';
import { boothService } from '@/services/booth.service';
import type { BoothInfo } from '@/types/booth.types';

export function BoothListPage() {
  const navigate = useNavigate();
  const [booths, setBooths] = useState<BoothInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBooths();
    const interval = setInterval(loadBooths, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadBooths = async () => {
    try {
      const data = await boothService.getAllBooths();
      setBooths(data);
      setError(null);
    } catch (err) {
      setError('Failed to load booths');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4A9B7F';
      case 'in-session': return '#7A8FB8';
      case 'offline': return '#6B6D76';
      case 'error': return '#B87A7A';
      default: return '#6B6D76';
    }
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

  const formatLastActive = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-[#F0F2F5] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-[#F0F2F5]">
      {/* Header */}
      <div 
        className="border-b border-[#2A2C36]"
        style={{
          background: 'rgba(26, 28, 36, 0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                }}
              >
                Photo Booths
              </h1>
              <p className="text-[#9A9BA3]">
                {booths.length} {booths.length === 1 ? 'booth' : 'booths'} registered
              </p>
            </div>
            <button
              onClick={loadBooths}
              className="px-6 py-3 bg-[#22242E] border border-[#3A3C48] rounded-lg hover:bg-[#2A2C36] transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Booth Grid */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#B87A7A]/10 border border-[#B87A7A]/30 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-[#B87A7A]" />
            <span className="text-[#B87A7A]">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {booths.map((booth, index) => (
            <motion.div
              key={booth.identity.boothId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/admin/booths/${booth.identity.boothId}`)}
              className="cursor-pointer group"
              style={{
                background: 'rgba(34, 36, 46, 0.5)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(240, 242, 245, 0.08)',
                borderRadius: '1rem',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(240, 242, 245, 0.05)' }}
                  >
                    <Monitor className="w-6 h-6 text-[#F0F2F5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{booth.identity.boothName}</h3>
                    <p className="text-sm text-[#6B6D76]">ID: {booth.identity.boothId.slice(0, 8)}</p>
                  </div>
                </div>
                <Settings className="w-5 h-5 text-[#6B6D76] group-hover:text-[#F0F2F5] transition-colors" />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 mb-4">
                <Circle 
                  className="w-3 h-3"
                  style={{ 
                    fill: getStatusColor(booth.status.status),
                    color: getStatusColor(booth.status.status),
                  }}
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: getStatusColor(booth.status.status) }}
                >
                  {getStatusLabel(booth.status.status)}
                </span>
              </div>

              {/* Info Grid */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#9A9BA3]">Mode</span>
                  <span className="font-medium capitalize">{booth.config.mode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#9A9BA3]">Grid</span>
                  <span className="font-medium">{booth.status.activeGridId}</span>
                </div>
                {booth.status.hasPendingConfig && (
                  <div className="flex items-center gap-2 text-sm text-[#B8936E]">
                    <Clock className="w-4 h-4" />
                    <span>Pending update</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-[#2A2C36]">
                <div className="flex items-center gap-2 text-xs text-[#6B6D76]">
                  <Clock className="w-3 h-3" />
                  <span>Last active: {formatLastActive(booth.status.lastHeartbeat)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {booths.length === 0 && !loading && (
          <div className="text-center py-20">
            <Monitor className="w-16 h-16 text-[#3A3C48] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No booths registered</h3>
            <p className="text-[#9A9BA3]">Booths will appear here once they're registered</p>
          </div>
        )}
      </div>
    </div>
  );
}
