import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Sparkles, TreeDeciduous, Minus, Rocket } from 'lucide-react';
import { ArchitectureStyle } from './types';

interface ArchitectureSelectorProps {
  current: ArchitectureStyle;
  onChange: (style: ArchitectureStyle) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const architectures: { id: ArchitectureStyle; icon: React.ReactNode; label: string }[] = [
  { id: 'scientific', icon: <Beaker className="w-4 h-4" />, label: 'Scientific' },
  { id: 'fun', icon: <Sparkles className="w-4 h-4" />, label: 'Fun' },
  { id: 'nature', icon: <TreeDeciduous className="w-4 h-4" />, label: 'Nature' },
  { id: 'minimalist', icon: <Minus className="w-4 h-4" />, label: 'Minimal' },
  { id: 'space', icon: <Rocket className="w-4 h-4" />, label: 'Space' },
];

export function ArchitectureSelector({ current, onChange, isOpen, onToggle }: ArchitectureSelectorProps) {
  const currentArch = architectures.find(a => a.id === current);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
      <motion.div
        className="relative"
        initial={false}
      >
        {/* Toggle button */}
        <motion.button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {currentArch?.icon}
          <span className="text-xs font-medium text-foreground">{currentArch?.label}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-3 h-3 text-muted-foreground" viewBox="0 0 12 12" fill="none">
              <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Expanded selector */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-xl"
            >
              <div className="flex gap-2">
                {architectures.map((arch) => (
                  <motion.button
                    key={arch.id}
                    onClick={() => {
                      onChange(arch.id);
                      onToggle();
                    }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                      current === arch.id 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {arch.icon}
                    <span className="text-[10px] font-medium">{arch.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
