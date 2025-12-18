import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { useAdminStore } from '@/store/adminStore';
import { useMachineStore } from '@/store/machineStore';

import { IdleScreen } from '@/pages/machine/IdleScreen';
import { SetupScreen } from '@/pages/machine/SetupScreen';
import { CaptureScreen } from '@/pages/machine/CaptureScreen';
import { PaymentScreen } from '@/pages/machine/PaymentScreen';
import { PrintingScreen } from '@/pages/machine/PrintingScreen';
import { QRScreen } from '@/pages/machine/QRScreen';
import { ThankYouScreen } from '@/pages/machine/ThankYouScreen';

import { LoginPage } from '@/pages/admin/LoginPage';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ModePage } from '@/pages/admin/ModePage';
import { GridsPage } from '@/pages/admin/GridsPage';

function MachineApp() {
  const { loadConfig } = useMachineStore();

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return (
    <Routes>
      <Route path="/" element={<IdleScreen />} />
      <Route path="/setup" element={<SetupScreen />} />
      <Route path="/capture" element={<CaptureScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/printing" element={<PrintingScreen />} />
      <Route path="/qr" element={<QRScreen />} />
      <Route path="/thankyou" element={<ThankYouScreen />} />
    </Routes>
  );
}

function AdminApp() {
  const { isAuthenticated } = useAdminStore();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mode" element={<ModePage />} />
          <Route path="/grids" element={<GridsPage />} />
          <Route path="/content" element={<DashboardPage />} />
          <Route path="/layouts" element={<DashboardPage />} />
          <Route path="/machines" element={<DashboardPage />} />
          <Route path="/analytics" element={<DashboardPage />} />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  const { theme } = useAdminStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/machine/*" element={<MachineApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/" element={<Navigate to="/machine" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
