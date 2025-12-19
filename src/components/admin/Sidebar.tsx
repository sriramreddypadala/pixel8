import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Image,
  Palette,
  Monitor,
  BarChart3,
  LogOut,
  Grid,
} from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';
import { authService } from '@/services/auth.service';
import { ActiveBoothIndicator } from './ActiveBoothIndicator';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/mode', label: 'Mode Management', icon: Settings },
  { path: '/admin/grids', label: 'Grid Templates', icon: Grid },
  { path: '/admin/content', label: 'Content', icon: Image },
  { path: '/admin/machines', label: 'Machines', icon: Monitor },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const { user, logout } = useAdminStore();

  const handleLogout = async () => {
    await authService.logout();
    logout();
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
          Pixxel8
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Admin Portal</p>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <ActiveBoothIndicator />
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="ml-auto w-2 h-2 bg-white rounded-full"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{user?.role}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );
}
