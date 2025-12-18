import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useMachineStore } from '@/store/machineStore';
import { formatCurrency } from '@/utils/helpers';

export function PaymentScreen() {
  const navigate = useNavigate();
  const { session } = useMachineStore();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');

  const basePrice = session?.layout?.price || 0;
  const additionalCopies = (session?.copies || 1) - 1;
  const additionalPrice = additionalCopies * 50;
  const totalPrice = basePrice + additionalPrice;

  const handlePayment = () => {
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('success');
      setTimeout(() => {
        navigate('/machine/printing');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Payment
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400">
            Complete your payment to print
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Photo Preview
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {session?.photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-square rounded-xl overflow-hidden border-4 border-gray-200 dark:border-gray-700"
                >
                  <img
                    src={photo.dataUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600 dark:text-gray-400">Layout</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {session?.layout?.name}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(basePrice)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-600 dark:text-gray-400">Copies</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {session?.copies}
                </span>
              </div>
              {additionalCopies > 0 && (
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 dark:text-gray-400">
                    Additional Copies ({additionalCopies})
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(additionalPrice)}
                  </span>
                </div>
              )}
              <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-2xl">
                  <span className="font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {paymentStatus === 'pending' && (
              <Button size="xl" fullWidth onClick={handlePayment}>
                <CreditCard className="w-6 h-6 mr-2" />
                Pay Now
              </Button>
            )}

            {paymentStatus === 'processing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900 dark:text-white">
                  Processing Payment...
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  Payment Successful!
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Redirecting to printing...
                </p>
              </motion.div>
            )}

            {paymentStatus === 'failed' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center py-8"
              >
                <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Payment Failed
                </p>
                <Button variant="danger" onClick={() => setPaymentStatus('pending')}>
                  Try Again
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
