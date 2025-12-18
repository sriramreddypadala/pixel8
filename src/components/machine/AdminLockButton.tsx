import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AdminLockButtonProps {
  onUnlock: () => void;
}

export function AdminLockButton({ onUnlock }: AdminLockButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setShowModal(false);
      setPassword('');
      setError('');
      onUnlock();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <>
      <motion.button
        className="fixed top-8 right-8 p-4 bg-white/10 backdrop-blur-md rounded-full z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowModal(true)}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Lock className="w-6 h-6 text-white" />
      </motion.button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPassword('');
          setError('');
        }}
        title="Admin Access"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            placeholder="Enter admin password"
            autoFocus
          />
          <Button type="submit" fullWidth>
            Unlock
          </Button>
        </form>
      </Modal>
    </>
  );
}
