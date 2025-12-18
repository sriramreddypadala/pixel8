import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Toggle } from '@/components/ui/Toggle';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useMachineStore } from '@/store/machineStore';

export function ModePage() {
  const { mode, setMode, config, resetEventPrintCount } = useMachineStore();
  const [eventName, setEventName] = useState(config?.eventName || '');
  const [eventMessage, setEventMessage] = useState(config?.eventMessage || '');

  const isEventMode = mode === 'EVENT';

  const handleModeToggle = (enabled: boolean) => {
    setMode(enabled ? 'EVENT' : 'NORMAL');
  };

  const handleResetCounter = () => {
    resetEventPrintCount();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Mode Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Control machine operation mode and event settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Operating Mode
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Switch between normal and event mode
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Event Mode
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Free printing for events
                    </p>
                  </div>
                  <Toggle
                    enabled={isEventMode}
                    onChange={handleModeToggle}
                  />
                </div>
                <div className={`text-sm ${isEventMode ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}`}>
                  {isEventMode ? '✓ Event mode active' : 'Normal mode active'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Normal Mode
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Payment required for prints
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-200 mb-1">
                    Event Mode
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Free prints for guests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-600 dark:text-accent-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Event Settings
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Configure event-specific options
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Input
                label="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g., John & Jane's Wedding"
                disabled={!isEventMode}
              />
              <Input
                label="Event Message"
                value={eventMessage}
                onChange={(e) => setEventMessage(e.target.value)}
                placeholder="e.g., Thank you for celebrating with us!"
                disabled={!isEventMode}
              />
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Event Print Counter
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Reset counter for new event
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleResetCounter}
                    disabled={!isEventMode}
                  >
                    Reset Counter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Sync Status
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-gray-700 dark:text-gray-300">
                All machines synced • Last update: Just now
              </span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
