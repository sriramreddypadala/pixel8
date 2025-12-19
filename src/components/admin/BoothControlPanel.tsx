/**
 * BOOTH CONTROL PANEL
 * Device-style settings panel for individual booth configuration
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GlassButton } from '@/components/ui/GlassButton';
import type { BoothInfo, BoothConfig } from '@/types/booth.types';

interface BoothControlPanelProps {
  booth: BoothInfo;
  onClose: () => void;
  onSave: (config: Partial<BoothConfig>) => void;
}

export function BoothControlPanel({ booth, onClose, onSave }: BoothControlPanelProps) {
  const [mode, setMode] = useState(booth.config.mode);
  const [activeGridId, setActiveGridId] = useState(booth.config.activeGridId);
  const [price, setPrice] = useState(booth.config.price);
  const [hasChanges, setHasChanges] = useState(false);

  const isInSession = booth.status.isInSession;
  const hasPendingConfig = booth.status.hasPendingConfig;

  useEffect(() => {
    const changed = 
      mode !== booth.config.mode ||
      activeGridId !== booth.config.activeGridId ||
      price !== booth.config.price;
    setHasChanges(changed);
  }, [mode, activeGridId, price, booth.config]);

  const handleSave = () => {
    onSave({
      boothId: booth.identity.boothId,
      mode,
      activeGridId,
      price,
      theme: booth.config.theme,
      updatedAt: new Date().toISOString(),
    });
    setHasChanges(false);
  };

  const handleCancel = () => {
    setMode(booth.config.mode);
    setActiveGridId(booth.config.activeGridId);
    setPrice(booth.config.price);
    setHasChanges(false);
  };

  const getSyncStatus = () => {
    if (hasPendingConfig) {
      return {
        icon: Clock,
        text: 'Pending - Will apply after session',
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/20',
      };
    }
    if (isInSession && hasChanges) {
      return {
        icon: AlertCircle,
        text: 'Booth in session - Changes will queue',
        color: 'text-orange-400',
        bg: 'bg-orange-500/20',
      };
    }
    if (!hasChanges) {
      return {
        icon: CheckCircle,
        text: 'Synced',
        color: 'text-green-400',
        bg: 'bg-green-500/20',
      };
    }
    return {
      icon: AlertCircle,
      text: 'Unsaved changes',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
    };
  };

  const syncStatus = getSyncStatus();
  const StatusIcon = syncStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full"
      >
        <GlassPanel className="rounded-2xl p-8" blur="heavy" opacity={0.95}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-1">
                {booth.identity.boothName}
              </h2>
              <p className="text-gray-400 font-mono text-sm">
                {booth.identity.boothId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sync Status */}
          <div className={`${syncStatus.bg} rounded-xl p-4 mb-6 flex items-center gap-3`}>
            <StatusIcon className={`w-5 h-5 ${syncStatus.color}`} />
            <span className={`font-semibold ${syncStatus.color}`}>
              {syncStatus.text}
            </span>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                Operating Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('normal')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mode === 'normal'
                      ? 'border-blue-400 bg-blue-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">Normal Mode</div>
                  <div className="text-xs opacity-70">Pay per print</div>
                </button>
                <button
                  onClick={() => setMode('event')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mode === 'event'
                      ? 'border-purple-400 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <div className="text-lg font-bold mb-1">Event Mode</div>
                  <div className="text-xs opacity-70">Free unlimited prints</div>
                </button>
              </div>
            </div>

            {/* Grid Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-3">
                Grid Layout
              </label>
              <select
                value={activeGridId}
                onChange={(e) => setActiveGridId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none"
              >
                <option value="grid-2x2-classic">2x2 Classic</option>
                <option value="grid-3x3-grid">3x3 Grid</option>
                <option value="grid-strip">Photo Strip</option>
                <option value="grid-collage">Collage</option>
              </select>
            </div>

            {/* Price (Normal Mode Only) */}
            {mode === 'normal' && (
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-3">
                  Price per Print (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  min="0"
                  step="10"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 focus:border-white/40 outline-none"
                />
              </div>
            )}

            {/* Session Warning */}
            {isInSession && hasChanges && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-300">
                    <strong>Booth is currently in use.</strong>
                    <br />
                    Changes will be queued and applied automatically when the current session ends.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <GlassButton
              onClick={handleSave}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!hasChanges}
            >
              <Save className="w-5 h-5 mr-2" />
              {isInSession ? 'Queue Changes' : 'Save Changes'}
            </GlassButton>
            <GlassButton
              onClick={handleCancel}
              variant="secondary"
              size="lg"
              disabled={!hasChanges}
            >
              Cancel
            </GlassButton>
          </div>
        </GlassPanel>
      </motion.div>
    </motion.div>
  );
}
