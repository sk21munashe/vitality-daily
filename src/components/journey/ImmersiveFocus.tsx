import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Target } from 'lucide-react';

interface TodayChallenge {
  id: string;
  emoji: string;
  title: string;
  points: number;
  completed: boolean;
}

interface ImmersiveFocusProps {
  challenge?: TodayChallenge;
  onComplete: () => void;
}

export function ImmersiveFocus({ challenge, onComplete }: ImmersiveFocusProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const defaultChallenge: TodayChallenge = challenge || {
    id: '1',
    emoji: '🎯',
    title: 'Reach 2L water intake',
    points: 25,
    completed: false,
  };

  const handleComplete = () => {
    if (defaultChallenge.completed) return;
    setIsCompleting(true);
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
    }, 600);
  };

  return (
    <motion.div
      className="relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-4">
        {/* Emoji indicator */}
        <motion.div
          className="text-3xl"
          animate={isCompleting ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {defaultChallenge.completed ? '✅' : defaultChallenge.emoji}
        </motion.div>

        {/* Challenge text */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${defaultChallenge.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {defaultChallenge.title}
          </p>
          <p className="text-xs text-primary font-medium">
            +{defaultChallenge.points} Points
          </p>
        </div>

        {/* Complete button */}
        <motion.button
          onClick={handleComplete}
          disabled={defaultChallenge.completed || isCompleting}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
            defaultChallenge.completed 
              ? 'bg-primary/20 text-primary' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          whileHover={{ scale: defaultChallenge.completed ? 1 : 1.05 }}
          whileTap={{ scale: defaultChallenge.completed ? 1 : 0.95 }}
          animate={isCompleting ? { scale: [1, 1.2, 1] } : {}}
        >
          {isCompleting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Target className="w-5 h-5" />
            </motion.div>
          ) : (
            <Check className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Completion celebration */}
      {isCompleting && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-primary"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i * 45 * Math.PI) / 180) * 50,
                y: Math.sin((i * 45 * Math.PI) / 180) * 30,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
