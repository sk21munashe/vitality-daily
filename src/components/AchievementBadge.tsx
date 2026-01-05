import { motion } from 'framer-motion';
import { Droplets, Utensils, Scale, Flame, Lock, Check } from 'lucide-react';
import { AchievementDefinition, AchievementTier } from '@/types/achievements';
import { format, parseISO } from 'date-fns';

interface AchievementBadgeProps {
  achievement: AchievementDefinition;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  isNewlyUnlocked?: boolean;
}

const tierStyles: Record<AchievementTier, { ring: string; bg: string; icon: string }> = {
  bronze: {
    ring: 'ring-amber-500/60',
    bg: 'bg-gradient-to-br from-amber-500 to-amber-700',
    icon: 'text-amber-100',
  },
  silver: {
    ring: 'ring-slate-400/60',
    bg: 'bg-gradient-to-br from-slate-300 to-slate-500',
    icon: 'text-slate-100',
  },
  gold: {
    ring: 'ring-yellow-400/60',
    bg: 'bg-gradient-to-br from-yellow-400 to-amber-500',
    icon: 'text-yellow-100',
  },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Utensils,
  Scale,
  Flame,
};

export function AchievementBadge({
  achievement,
  isUnlocked,
  unlockedAt,
  progress,
  isNewlyUnlocked,
}: AchievementBadgeProps) {
  const style = tierStyles[achievement.tier];
  const IconComponent = iconMap[achievement.icon] || Flame;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={isNewlyUnlocked ? { scale: 0 } : { opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={isNewlyUnlocked 
        ? { type: 'spring', stiffness: 300, damping: 20 }
        : { duration: 0.2 }
      }
      className="flex flex-col items-center gap-2 p-3"
    >
      {/* Circular badge */}
      <div className="relative">
        {/* Progress ring (only for locked) */}
        {!isUnlocked && (
          <svg className="absolute inset-0 w-16 h-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/30"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary/50 transition-all duration-500"
            />
          </svg>
        )}

        {/* Badge circle */}
        <motion.div
          animate={isNewlyUnlocked ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
            isUnlocked 
              ? `${style.bg} ring-4 ${style.ring} shadow-lg` 
              : 'bg-muted/40 ring-2 ring-muted-foreground/20'
          }`}
        >
          {isUnlocked ? (
            <IconComponent className={`w-7 h-7 ${style.icon}`} />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground/50" />
          )}
        </motion.div>

        {/* Checkmark for unlocked */}
        {isUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-md"
          >
            <Check className="w-3.5 h-3.5 text-white" />
          </motion.div>
        )}
      </div>

      {/* Title */}
      <span className={`text-xs font-medium text-center leading-tight max-w-[80px] ${
        isUnlocked ? 'text-foreground' : 'text-muted-foreground'
      }`}>
        {achievement.name}
      </span>

      {/* Date or progress */}
      <span className="text-[10px] text-muted-foreground">
        {isUnlocked && unlockedAt 
          ? format(parseISO(unlockedAt), 'MMM d')
          : `${Math.round(progress)}%`
        }
      </span>
    </motion.div>
  );
}
