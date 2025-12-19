/**
 * ANALYTICS PAGE
 * Usage insights and operational metrics
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Printer, Calendar, Activity } from 'lucide-react';
import { useAnalyticsStore } from '@/store/analyticsStore';
import { GlassPanel } from '@/components/ui/GlassPanel';
import {
  MOCK_ANALYTICS_SUMMARY,
  MOCK_PRINT_TRENDS,
  MOCK_BOOTH_ANALYTICS,
  MOCK_MODE_COMPARISON,
} from '@/utils/mockData';

export function AnalyticsPage() {
  const {
    summary,
    printTrends,
    boothAnalytics,
    modeComparison,
    setSummary,
    setPrintTrends,
    setBoothAnalytics,
    setModeComparison,
  } = useAnalyticsStore();

  useEffect(() => {
    setSummary(MOCK_ANALYTICS_SUMMARY);
    setPrintTrends(MOCK_PRINT_TRENDS);
    setBoothAnalytics(MOCK_BOOTH_ANALYTICS);
    setModeComparison(MOCK_MODE_COMPARISON);
  }, [setSummary, setPrintTrends, setBoothAnalytics, setModeComparison]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Analytics</h1>
          <p className="text-gray-400 text-lg">Usage insights and operational metrics</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-semibold">Total Prints</span>
                  <Printer className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {formatNumber(summary.totalPrints)}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    +{summary.weekPrints} this week
                  </span>
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-semibold">Event Prints</span>
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {formatNumber(summary.eventPrints)}
                </div>
                <div className="text-sm text-gray-400">
                  {Math.round((summary.eventPrints / summary.totalPrints) * 100)}% of total
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-semibold">Normal Prints</span>
                  <Printer className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {formatNumber(summary.normalPrints)}
                </div>
                <div className="text-sm text-gray-400">
                  {Math.round((summary.normalPrints / summary.totalPrints) * 100)}% of total
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm font-semibold">Active Booths</span>
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {summary.activeBooths}
                </div>
                <div className="text-sm text-gray-400">
                  of {summary.totalBooths} total
                </div>
              </GlassPanel>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Print Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
              <h3 className="text-xl font-black text-white mb-4">Print Trends (30 Days)</h3>
              <div className="h-64 flex items-end justify-between gap-1">
                {printTrends.slice(-15).map((trend, index) => {
                  const maxPrints = Math.max(...printTrends.map(t => t.prints));
                  const height = (trend.prints / maxPrints) * 100;
                  return (
                    <motion.div
                      key={trend.date}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 0.5 + index * 0.02 }}
                      className="flex-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm min-w-[8px] relative group"
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        <br />
                        {trend.prints} prints
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{new Date(printTrends[printTrends.length - 15]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span>{new Date(printTrends[printTrends.length - 1]?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Mode Comparison */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
              <h3 className="text-xl font-black text-white mb-4">Mode Comparison</h3>
              <div className="space-y-6">
                {modeComparison.map((mode, index) => (
                  <motion.div
                    key={mode.mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold capitalize">{mode.mode} Mode</span>
                      <span className="text-gray-400 text-sm">{formatNumber(mode.prints)} prints</span>
                    </div>
                    <div className="relative h-8 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mode.percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          mode.mode === 'event'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                            : 'bg-gradient-to-r from-green-500 to-blue-500'
                        }`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{mode.percentage}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Booth Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassPanel className="p-6 rounded-2xl" blur="medium" opacity={0.7}>
            <h3 className="text-xl font-black text-white mb-4">Booth Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Booth Name</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Total Prints</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Event</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Normal</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Avg Session</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {boothAnalytics.map((booth, index) => (
                    <motion.tr
                      key={booth.boothId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="text-white font-semibold">{booth.boothName}</div>
                        <div className="text-xs text-gray-500 font-mono">{booth.boothId.slice(0, 8)}...</div>
                      </td>
                      <td className="text-right py-4 px-4 text-white font-bold">
                        {formatNumber(booth.totalPrints)}
                      </td>
                      <td className="text-right py-4 px-4 text-purple-400 font-semibold">
                        {formatNumber(booth.eventPrints)}
                      </td>
                      <td className="text-right py-4 px-4 text-green-400 font-semibold">
                        {formatNumber(booth.normalPrints)}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-400">
                        {formatTime(booth.avgSessionTime)}
                      </td>
                      <td className="text-right py-4 px-4 text-gray-400 text-sm">
                        {new Date(booth.lastActive).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
}
