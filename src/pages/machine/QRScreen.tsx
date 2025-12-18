import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Clock } from 'lucide-react';
import { useMachineStore } from '@/store/machineStore';

export function QRScreen() {
  const navigate = useNavigate();
  const { session, config } = useMachineStore();
  const [timeLeft, setTimeLeft] = useState(30);

  const qrData = JSON.stringify({
    sessionId: session?.sessionId,
    photos: session?.photos.map(p => p.dataUrl),
    layoutPhoto: 'layout-final.jpg',
    promotionalImage: config?.promotionalImageUrl,
    timestamp: Date.now(),
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/machine/thankyou');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Get Your Digital Copies
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400">
            Scan the QR code to download your photos
          </p>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl mb-8 inline-block"
        >
          <QRCodeSVG
            value={qrData}
            size={400}
            level="H"
            includeMargin
            className="mx-auto"
          />
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Download className="w-12 h-12 text-primary-500" />
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                What's Included
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                All your photos in high quality
              </p>
            </div>
          </div>
          <ul className="text-left space-y-3 text-lg text-gray-700 dark:text-gray-300">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              Individual photos from your session
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
              Final layout composition
            </li>
            {config?.promotionalImageUrl && (
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full" />
                Exclusive promotional content
              </li>
            )}
          </ul>
        </div>

        <motion.div
          className="flex items-center justify-center gap-4 text-2xl font-semibold text-gray-700 dark:text-gray-300"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Clock className="w-8 h-8 text-primary-500" />
          <span>Auto-continuing in {timeLeft} seconds</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
