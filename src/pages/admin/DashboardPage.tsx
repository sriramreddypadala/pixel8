import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Printer, Image, Zap, Activity } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { Card } from '@/components/ui/Card';
import { useMachineStore } from '@/store/machineStore';
import { MOCK_MACHINES } from '@/utils/mockData';

export function DashboardPage() {
  const { printStats } = useMachineStore();
  const [machines] = useState(MOCK_MACHINES);

  const activeMachines = machines.filter(m => m.status === 'ONLINE').length;
  const totalPaperUsed = Math.floor((printStats.totalPrints / 100) * 100);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your photo booth operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Prints"
          value={printStats.totalPrints}
          icon={Printer}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Event Prints"
          value={printStats.eventPrints}
          icon={Image}
          color="accent"
        />
        <StatCard
          title="Active Machines"
          value={`${activeMachines}/${machines.length}`}
          icon={Activity}
          color="success"
        />
        <StatCard
          title="Paper Used"
          value={`${totalPaperUsed}%`}
          icon={Zap}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Machine Status
            </h2>
            <div className="space-y-4">
              {machines.map((machine) => (
                <motion.div
                  key={machine.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {machine.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {machine.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        machine.status === 'ONLINE'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : machine.status === 'OFFLINE'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {machine.status}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {machine.printStats.totalPrints} prints
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <Printer className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Print Job Completed
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Machine #{i + 1} • 2x2 Layout • 2 copies
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {i + 1} minutes ago
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
