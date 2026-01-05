import { motion } from 'framer-motion';
import { Camera, Droplets } from 'lucide-react';

interface FloatingActionsProps {
  onScanFood: () => void;
  onLogWater: () => void;
}

export function FloatingActions({ onScanFood, onLogWater }: FloatingActionsProps) {
  return (
    <motion.div
      className="fixed bottom-24 right-4 flex flex-col gap-3 z-40"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.button
        onClick={onLogWater}
        className="w-12 h-12 rounded-full bg-water/90 text-white shadow-water flex items-center justify-center backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Droplets className="w-5 h-5" />
      </motion.button>
      
      <motion.button
        onClick={onScanFood}
        className="w-12 h-12 rounded-full bg-nutrition/90 text-white shadow-nutrition flex items-center justify-center backdrop-blur-sm"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Camera className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
}
